// Import base modules
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import Result "mo:base/Result";
import Types "./types";
import Array "mo:base/Array";
import UUID "mo:uuid/UUID";
import Iter "mo:base/Iter";
import Err "mo:base/Error";
import Bool "mo:base/Bool";
import HashMap "mo:base/HashMap";
import Cycles "mo:base/ExperimentalCycles";
import Option "mo:base/Option";
import Nat64 "mo:base/Nat64";
import Xtc "./xtc";

shared (msg) actor class crowdsale (init: Types.Initialization) = this {
    private let admin = msg.caller;
    private let g = UUID.Generator();

    public type Crowdsale = Types.Crowdsale;
    public type CrowdsaleCreate = Types.CrowdsaleCreate;
    public type CrowdsaleUpdate = Types.CrowdsaleUpdate;
    public type CrowdsaleId = Types.CrowdsaleId;
    public type UserId = Types.UserId;
    public type Status = Types.Status;
    public type Error = Types.Error;
    public type PrincipalToNat = Types.PrincipalToNat;
    public type PrincipalToNatEntry = Types.PrincipalToNatEntry;
    public type Data = Types.Data;
    public type Canisters = Types.Canisters;
    public type Info = Types.Info;
    public type Block = Types.Block;
    public type Status_v2 = Types.Status_v2;
    public type BlocksRequest = Types.BlocksRequest;
    public type HistoryRequest = Types.HistoryRequest;
    public type HistoryResponse = Types.HistoryResponse;
    public type Event = Types.Event;
    public type ProjectDetails_v2 = Types.ProjectDetails_v2;
    public type SetDetailsRequest = Types.SetDetailsRequest;

    // Global state
    var ledger: PrincipalToNat = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
    stable var ledgerEntries: [PrincipalToNatEntry] = [];
    var data: [var Data] = [var];

    // Stats
    stable var cubesSupply: Nat = 0;
    stable var xtcBalance: Nat = 0;
    stable var salesTotal: Nat = 0;
    stable var lastTaxTimestamp: Int = 0;
    stable var taxCollected: Nat = 0;
    stable var feesCollected: Nat = 0;
    stable var foreclosureCount: Nat = 0;

    stable var controller: Principal = init.controller;
    stable var controllers: [Principal] = [init.controller];
    stable var canisters: Canisters = init.canisters;
    let xtc = actor (Principal.toText(canisters.xtc)) : Xtc.Self;

    // Economic parameters
    let TC = 1_000_000_000_000;
    let minimumCycleBalance = TC / 2;
    let maximumCycleBalance = TC * 100;

    // Аees are in percent times 1e8, ie. 100% = 1e8
    stable var TRANSACTION_FEE = 1_000_000;
    stable var ANNUAL_TAX_RATE = 5_000_000;
    stable var FORECLOSURE_PRICE = 1 * TC;

    private stable var crowdsales : Trie.Trie<CrowdsaleId, Crowdsale> = Trie.empty();

    public shared query(msg) func getOwnId() : async UserId { admin };

    // create crowdsale
    public shared(msg) func createCrowdsale(crowdsaleCreate: CrowdsaleCreate) : async Result.Result<(Text), Error> {
        let now = Time.now();
        let callerId = msg.caller;
        let id = UUID.toText(g.new());
        let dayTimeframe = now + (3600 * 1000_000_000);

        // Reject AnonymousIdentity
        // if(Principal.toText(callerId) == "2vxsx-fae") {
        //     Debug.print(debug_show(callerId));
        //     throw Err.reject("An anonymus user cannot create a crowdsale");
        // };

        if (crowdsaleCreate.deadline <= dayTimeframe) {
            Debug.print(debug_show(now));
            throw Err.reject("The deadline cannot be less than 24 hours from the date of creation");
        };

        if (crowdsaleCreate.offerPrice <= 0) {
            throw Err.reject("Offer price cannot be less or equal than 0");
        };

        let crowdsale: Crowdsale = {
            crowdsaleId = id;
            creator = callerId;
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #open;
            offerPrice = crowdsaleCreate.offerPrice;
            deadline = crowdsaleCreate.deadline;
            contributedAmount = 0;
            contributions = Trie.empty();
            identity = Principal.toText(callerId);
        };

        let (newCrowdsales, existing) = Trie.put(
            crowdsales,
            key(id),
            Text.equal,
            crowdsale
        );

        switch(existing) {
            case null {
                crowdsales := newCrowdsales;
                #ok((id));
            };
            case (? v) {
                #err(#AlreadyExists);
            };
        };
    };

    // get crowdsale by its id
    public query(msg) func getCrowdsale(id: CrowdsaleId) : async Result.Result<Crowdsale, Error> {
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        return Result.fromOption(result, #NotFound);
    };

    // update crowdsale by its id
    public shared(msg) func update(crowdsaleUpdate: CrowdsaleUpdate) : async Result.Result<(Text), Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(crowdsaleUpdate.crowdsaleId),
            Text.equal
        );

        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                if (v.creator != callerId) {
                    throw Err.reject("No access");
                };
                if (crowdsaleUpdate.offerPrice > v.offerPrice) {
                    throw Err.reject("Offer price reduction is only allowed");
                };
                let crowdsale: Crowdsale = {
                    crowdsaleId = crowdsaleUpdate.crowdsaleId;
                    creator = v.creator;
                    createdAt = v.createdAt;
                    updatedAt = Time.now();
                    status = v.status;
                    offerPrice = crowdsaleUpdate.offerPrice;
                    deadline = crowdsaleUpdate.deadline;
                    contributedAmount = v.contributedAmount;
                    contributions = v.contributions;
                    identity = v.identity;
                };
                crowdsales := Trie.replace(
                    crowdsales,
                    key(crowdsaleUpdate.crowdsaleId),
                    Text.equal,
                    ?crowdsale
                ).0;
                #ok((crowdsaleUpdate.crowdsaleId));
            };
        };
    };

    // delete crowdsale by its id
    public shared(msg) func delete(id: CrowdsaleId) : async Result.Result<(Text), Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );

        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                if (v.creator != callerId) {
                    throw Err.reject("No access");
                };
                crowdsales := Trie.replace(
                    crowdsales,
                    key(id),
                    Text.equal,
                    null
                ).0;
                #ok((id));
            };
        };
    };

    // make contribution to crowdsale
    public shared(msg) func makeContribution(id: CrowdsaleId, amount: Float) : async Result.Result<(Text), Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                if (Time.now() > v.deadline) {
                    throw Err.reject("Crowdsale expired");
                };
                let foundContributions = Trie.find(
                    v.contributions,
                    keyPrincipal(callerId),
                    Principal.equal
                );
                switch (foundContributions) {
                    case null {
                        let (newContributions, _) = Trie.put(
                            v.contributions,
                            keyPrincipal(callerId),
                            Principal.equal,
                            amount
                        );
                        let crowdsale: Crowdsale = {
                            crowdsaleId = v.crowdsaleId;
                            creator = v.creator;
                            createdAt = v.createdAt;
                            updatedAt = Time.now();
                            status = v.status;
                            offerPrice = v.offerPrice;
                            deadline = v.deadline;
                            contributedAmount = v.contributedAmount + amount;
                            contributions = newContributions;
                            identity = v.identity;
                        };
                        crowdsales := Trie.replace(
                            crowdsales,
                            key(v.crowdsaleId),
                            Text.equal,
                            ?crowdsale
                        ).0;
                    };
                    case (? c) {
                        let (newContributions, _) = Trie.put(
                            v.contributions,
                            keyPrincipal(callerId),
                            Principal.equal,
                            c + amount
                        );
                        let crowdsale: Crowdsale = {
                            crowdsaleId = v.crowdsaleId;
                            creator = v.creator;
                            createdAt = v.createdAt;
                            updatedAt = Time.now();
                            status = v.status;
                            offerPrice = v.offerPrice;
                            deadline = v.deadline;
                            contributedAmount = v.contributedAmount + amount;
                            contributions = newContributions;
                            identity = v.identity;
                        };
                        crowdsales := Trie.replace(
                            crowdsales,
                            key(v.crowdsaleId),
                            Text.equal,
                            ?crowdsale
                        ).0;
                    };
                };
                checkIfFulfilled(v.crowdsaleId);
                #ok((v.crowdsaleId));
            };
        };
    };

    // check if the crowdsale fulfilled and if yes, set status to fulfiled
    private func checkIfFulfilled(id: CrowdsaleId) {
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {};
            case (? v) {
                if (v.contributedAmount >= v.offerPrice) {
                    let crowdsale: Crowdsale = {
                        crowdsaleId = v.crowdsaleId;
                        creator = v.creator;
                        createdAt = v.createdAt;
                        updatedAt = Time.now();
                        status = #fulfilled;
                        offerPrice = v.offerPrice;
                        deadline = v.deadline;
                        contributedAmount = v.contributedAmount;
                        contributions = v.contributions;
                        identity = v.identity;
                    };
                    crowdsales := Trie.replace(
                        crowdsales,
                        key(v.crowdsaleId),
                        Text.equal,
                        ?crowdsale
                    ).0;
                }; 
            };
        };
    };

    // check and update crowdsale status
    public shared(msg) func checkAndUpdateStatus(id: CrowdsaleId) {
        let callerId = msg.caller;
        let now = Time.now();
        if (admin != callerId) {
            throw Err.reject("No access");
        };
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {};
            case (? v) {
                if (now <= v.deadline) { return; }
                else {
                    if (v.status == #fulfilled) {
                        // run distribution routine
                        Debug.print("DISTRIBUTE THEM ALL!!!!111");
                    } else if (v.status == #open) {
                        let crowdsale: Crowdsale = {
                            crowdsaleId = v.crowdsaleId;
                            creator = v.creator;
                            createdAt = v.createdAt;
                            updatedAt = Time.now();
                            status = #failed;
                            offerPrice = v.offerPrice;
                            deadline = v.deadline;
                            contributedAmount = v.contributedAmount;
                            contributions = v.contributions;
                            identity = v.identity;
                        };
                        crowdsales := Trie.replace(
                            crowdsales,
                            key(v.crowdsaleId),
                            Text.equal,
                            ?crowdsale
                        ).0;
                    };
                };
            };
        };
    };

    // retrieve all crowdsale contributions by its id
    public query func getAllContributionsByCrowdsaleId(id: CrowdsaleId) : async Result.Result<(Trie.Trie<Principal, Float>), Error> {
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                #ok((v.contributions));
            };
        };
    };

    // retrieve crowdsale contribution by its id and caller
    public query(msg) func getContributionByCallerAndCrowdsaleId(id: CrowdsaleId) : async Result.Result<(Float), Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? c) {
                let foundContributions = Trie.find(
                    c.contributions,
                    keyPrincipal(callerId),
                    Principal.equal
                );
                switch (foundContributions) {
                    case null {
                        #err(#NotFound);
                    };
                    case (? v) {
                        #ok((v));
                    }
                };
            };
        };
    };

    // retrieve crowdsale contributions by its id and principal
    public func getContributionByPrincipalAndCrowdsaleId(id: CrowdsaleId, callerId: Principal) : async Result.Result<(Float), Error> {
        let result = Trie.find(
            crowdsales,
            key(id),
            Text.equal
        );
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? c) {
                let foundContributions = Trie.find(
                    c.contributions,
                    keyPrincipal(callerId),
                    Principal.equal
                );
                switch (foundContributions) {
                    case null {
                        #err(#NotFound);
                    };
                    case (? v) {
                        #ok((v));
                    }
                };
            };
        };
    };

    // retrieve all created crowdsales
    public query(msg) func getAllCrowdsales() : async [Crowdsale] {
        let result = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        return result;
    };

    // retrieve all created crowdsales by caller
    public query(msg) func getCrowdsalesByCaller() : async [Crowdsale] {
        let caller = msg.caller;
        let allCrowdsales = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        var result: [Crowdsale] = [];
        for (i in Iter.range(0, allCrowdsales.size() - 1)) {
            switch(allCrowdsales[i]) {
                case (crowdsale) {
                    if (crowdsale.creator == caller) {
                        result := Array.append<Crowdsale>(result, [crowdsale]);
                    };
                };
            };
        };
        result;
    };

    // retrieve all created crowdsales by creator
    public query(msg) func getCrowdsalesByCreator(creator: Principal) : async [Crowdsale] {
        let allCrowdsales = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        var result: [Crowdsale] = [];
        for (i in Iter.range(0, allCrowdsales.size() - 1)) {
            switch(allCrowdsales[i]) {
                case (crowdsale) {
                    if (crowdsale.creator == creator) {
                        result := Array.append<Crowdsale>(result, [crowdsale]);
                    };
                };
            };
        };
        result;
    };

    public query func info(): async Info {
        {
            projectCount = data.size();
            stats = {
                xtcBalance = xtcBalance;
                cyclesBalance = Cycles.balance();
                cubesSupply = cubesSupply;
                ownCubesBalance = Option.get(ledger.get(thisPrincipal()), 0);
                feesCollected = feesCollected;
                taxCollected = taxCollected;
                transactionsCount = Array.foldLeft<Data, Nat>(Array.freeze(data), 0, func (sum, ({transferCount})) {
                    sum + transferCount
                });
                foreclosureCount = foreclosureCount;
                salesTotal = salesTotal;
                transactionFee = TRANSACTION_FEE;
                annualTaxRate = ANNUAL_TAX_RATE;
                lastTaxTimestamp = lastTaxTimestamp;
            };
            canisters = canisters;
            controllers = controllers;
        }
    };
    

    public query func owners(projectId: Nat): async [Block] {
        latestBlocks(projectId)
    };

    func latestBlocks(projectId: Nat): [Block] {
        let {owners; status} = data[projectId];

        Array.map<Block, Block>(Array.freeze(owners), func (block) {
            if (block.owner == status.owner) {
                blockWithTimeNow(block, status)
            } else {
                block
            }
        })
    };

    func blockWithTimeNow(block: Block, status: Status_v2): Block {
        {
            id = block.id;
            owner = block.owner;
            lastPurchasePrice = block.lastPurchasePrice;
            lastSalePrice = block.lastSalePrice;
            lastSaleTime = block.lastSaleTime;
            totalSaleCount = block.totalSaleCount;
            totalOwnedTime = block.totalOwnedTime + (Time.now() - status.offerTimestamp);
            totalValue = block.totalValue;
        }
    };

    /* Return 100 sorted blocks, no pagination */
    public query func getBlocks(request: BlocksRequest): async [Block] {
        let data = latestBlocks(request.projectId);

        let sorted = switch (request.orderBy, request.order) {
        case (#id, #asc) { data };
        case (#id, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.id > a.id) { #greater } else { #less }
        }) };
        case (#lastPurchasePrice, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastPurchasePrice < a.lastPurchasePrice) { #greater } else { #less }
        }) };
        case (#lastPurchasePrice, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastPurchasePrice > a.lastPurchasePrice) { #greater } else { #less }
        }) };
        case (#lastSalePrice, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastSalePrice < a.lastSalePrice) { #greater } else { #less }
        }) };
        case (#lastSalePrice, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastSalePrice > a.lastSalePrice) { #greater } else { #less }
        }) };
        case (#lastSaleTime, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastSaleTime < a.lastSaleTime) { #greater } else { #less }
        }) };
        case (#lastSaleTime, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.lastSaleTime > a.lastSaleTime) { #greater } else { #less }
        }) };
        case (#totalOwnedTime, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalOwnedTime < a.totalOwnedTime) { #greater } else { #less }
        }) };
        case (#totalOwnedTime, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalOwnedTime > a.totalOwnedTime) { #greater } else { #less }
        }) };
        case (#totalValue, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalValue < a.totalValue) { #greater } else { #less }
        }) };
        case (#totalValue, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalValue > a.totalValue) { #greater } else { #less }
        }) };
        case (#totalSaleCount, #asc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalSaleCount < a.totalSaleCount) { #greater } else { #less }
        }) };
        case (#totalSaleCount, #desc) { Array.sort<Block>(data, func(a, b) {
            if (b.totalSaleCount > a.totalSaleCount) { #greater } else { #less }
        }) };
        };

        Array.tabulate<Block>(Nat.min(100, sorted.size()), func (i) {
            sorted[i]
        });
    };

    public query func getHistory(request: HistoryRequest): async HistoryResponse {
        let {events; transferCount} = data[request.projectId];
        let (max, filtered) = switch (request.principal) {
            case (?principal) {
                let filtered = Array.filter<Event>(events, func ({ data }) {
                    switch (data) {
                        case (#Transfer({from; to})) {
                            from == principal or to == principal
                        };
                        case (#PriceChange({owner})) {
                            owner == principal
                        }
                    }
                });
                (filtered.size(), filtered)
            };
            case _ {
                (Nat.min(100, events.size()), events)
            }
        };
        let size = filtered.size();
        {
            events = Array.tabulate<Event>(max, func (i) {
                filtered[size - i - 1]
            });
            count = events.size();
        }
    };

    public query({ caller }) func balance(user_: ?Principal) : async Nat {
        let user = Option.get(user_, caller);
        Option.get(ledger.get(user), 0)
    };

    // Deposit XTC
    public shared({ caller }) func depositXtc(owner: Principal) : async Nat {
        assert(caller == canisters.xtc);
        let amount = Cycles.available();
        let accepted = Cycles.accept(amount);
        assert(accepted > 0);
        ledger.put(owner, Option.get(ledger.get(owner), 0) + accepted);
        cubesSupply := cubesSupply + accepted;
        let balance = Cycles.balance();
        if (balance > maximumCycleBalance) {
            let diff = balance - maximumCycleBalance : Nat;
            Cycles.add(diff);
            switch (await xtc.mint(null)) {
                case (#Err(error)) {
                    Debug.print("minting XTC failed: " # debug_show(error));
                };
                case _ {
                    xtcBalance := Nat64.toNat(await xtc.balance(null));
                }
            };
        };
        accepted;
    };

    // Deposit raw cycles
    public shared({ caller }) func wallet_receive() : async Nat {
        let amount = Cycles.available();
        let accepted = Cycles.accept(amount);
        assert(accepted > 0);
        ledger.put(caller, Option.get(ledger.get(caller), 0) + accepted);
        cubesSupply := cubesSupply + accepted;
        accepted;
    };

    // Accept raw cycles
    public shared func acceptCycles() : async () {
        let amount = Cycles.available();
        let accepted = Cycles.accept(amount);
        assert(accepted > 0);
    };

    // ---- Controller functions

    public shared({ caller }) func newProject(details: ProjectDetails_v2): async () {
        onlyController(caller);

        let item : Data = {
        projectId = data.size();
        details = details;
        owners = [var];
        status = {
            owner = thisPrincipal();
            offerTimestamp = Time.now();
            offerValue = 1_000_000_000_000;
            isForeclosed = false;
        };
        ownerIds = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
        events = [];
        transferCount = 0;
        };
        data := Array.thaw(Array.append(Array.freeze(data), [item]));
    };

    public shared({ caller }) func setDetails(request: SetDetailsRequest): async () {
        onlyController(caller);

        let {projectId; details; owners; ownerIds; status; events; transferCount} = data[request.projectId];

        data[projectId] := {
            projectId = projectId;
            details = {
                name = Option.get(request.name, details.name);
                description = Option.get(request.description, details.description);
                creator = Option.get(request.creator, details.creator);
                createdTime  = Option.get(request.createdTime, details.createdTime);
                isActive = Option.get(request.isActive, details.isActive);
            };
            owners = owners;
            status = status;
            ownerIds = ownerIds;
            events = events;
            transferCount = transferCount;
        }
    };

    private func extractCrowdsale(k : Text, v : Crowdsale) : Crowdsale {
        return v;
    };

    private func key(x : Text) : Trie.Key<CrowdsaleId> {
        return { key = x; hash = Text.hash(x) }
    };

    private func keyPrincipal(x : Principal) : Trie.Key<Principal>{
        return { key = x; hash = Principal.hash(x) }
    };

    private func transform(id: CrowdsaleId, crowdsale: Crowdsale): Crowdsale {
        return crowdsale;
    };

    public shared (msg) func whoami() : async Principal {
        msg.caller
    };

    public shared (msg) func whoamiText() : async Text {
        let caller = msg.caller;
        let identity = Principal.toText(caller);
        return "My identity is : " # identity # " !!!";
    };

    func onlyController(caller: Principal): () {
        assert(Option.isSome(Array.find<Principal>(controllers, func (c) { c == caller })))
    };

    func thisPrincipal(): Principal { Principal.fromActor(this) };
};