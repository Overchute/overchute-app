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
import A "./account";   
import Hex "./hex";
import ICP "./ICPLedger";
import U "./utils";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat64 "mo:base/Nat64";
import Prim "mo:⛔";

shared (msg) actor class crowdsale (owner: Principal) = this {
    private stable let admin : Principal = owner;
    private let g = UUID.Generator();

    public type Crowdsale = Types.Crowdsale;
    public type CrowdsaleCreate = Types.CrowdsaleCreate;
    public type CrowdsaleUpdate = Types.CrowdsaleUpdate;
    public type CrowdsaleId = Types.CrowdsaleId;
    public type CrowdsaleContribution = Types.CrowdsaleContribution;
    public type CrowdsaleOvershootShare = Types.CrowdsaleOvershootShare;
    public type UserId = Types.UserId;
    public type Status = Types.Status;
    public type Error = Types.Error;

    type Details = Types.Details;
    type Token = Types.Token;
    type TokenVerbose = Types.TokenVerbose;
    type AccountIdentifier = Types.AccountIdentifier;
    type Invoice = Types.Invoice;

    private stable var crowdsales : Trie.Trie<CrowdsaleId, Crowdsale> = Trie.empty();
    private stable var invoiceCounter : Nat = 0;
    private stable var entries : [(Nat, Invoice)] = [];
    var invoices: HashMap.HashMap<Nat, Invoice> = HashMap.HashMap(16, Nat.equal, Hash.hash);

    public shared query(msg) func getOwnId() : async UserId { admin };

    // create crowdsale
    public shared(msg) func createCrowdsale(crowdsaleCreate: CrowdsaleCreate) : async Result.Result<(Text), Error> {
        let now = Time.now();
        let callerId = msg.caller;
        let id = UUID.toText(g.new());
        let dayTimeframe = now + (3600 * 1000_000_000);

        // Reject AnonymousIdentity
        // if (Principal.toText(callerId) == "2vxsx-fae") {
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

        if (crowdsaleCreate.refundBonusDeposit < 0) {
            throw Err.reject("Refund bonus deposit cannot be less than 0");
        };

        let crowdsale: Crowdsale = {
            crowdsaleId = id;
            creator = callerId;
            createdAt = Time.now();
            updatedAt = Time.now();
            status = #OPEN;
            productType = crowdsaleCreate.productType;
            offerPrice = crowdsaleCreate.offerPrice;
            deadline = crowdsaleCreate.deadline;
            contributedAmount = 0;
            contributions = [];
            refundBonusDeposit = crowdsaleCreate.refundBonusDeposit;
            license = crowdsaleCreate.license;
            imageUrl = crowdsaleCreate.imageUrl;
            identity = Principal.toText(callerId);
        };

        let (newCrowdsales, existing) = Trie.put(
            crowdsales,
            key(id),
            Text.equal,
            crowdsale
        );

        switch (existing) {
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
                    productType = v.productType;
                    offerPrice = crowdsaleUpdate.offerPrice;
                    deadline = crowdsaleUpdate.deadline;
                    contributedAmount = v.contributedAmount;
                    contributions = v.contributions;
                    refundBonusDeposit = v.refundBonusDeposit;
                    license = v.license;
                    imageUrl = v.imageUrl;
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
    public shared(msg) func makeContribution(crowdsaleId: CrowdsaleId, amount: Float) : async Result.Result<(Text), Error> {
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(crowdsaleId),
            Text.equal
        );
        if (amount <= 0) {
            throw Err.reject("Contribution must be more than 0");
        };
        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
                if (Time.now() > v.deadline) {
                    throw Err.reject("Crowdsale expired");
                };
                var newContributionsArray: [CrowdsaleContribution] = [];
                let contribution: CrowdsaleContribution = {
                    crowdsaleId = crowdsaleId;
                    contributor = callerId;
                    amount = amount;
                    date = Time.now();
                };
                newContributionsArray := Array.append<CrowdsaleContribution>(v.contributions, [contribution]);
                let crowdsale: Crowdsale = {
                    crowdsaleId = v.crowdsaleId;
                    creator = v.creator;
                    createdAt = v.createdAt;
                    updatedAt = Time.now();
                    productType = v.productType;
                    status = v.status;
                    offerPrice = v.offerPrice;
                    deadline = v.deadline;
                    contributedAmount = v.contributedAmount + amount;
                    contributions = newContributionsArray;
                    refundBonusDeposit = v.refundBonusDeposit;
                    license = v.license;
                    imageUrl = v.imageUrl;
                    identity = v.identity;
                };
                crowdsales := Trie.replace(
                    crowdsales,
                    key(v.crowdsaleId),
                    Text.equal,
                    ?crowdsale
                ).0;
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
                        status = #SUCCEEDED;
                        productType = v.productType;
                        offerPrice = v.offerPrice;
                        deadline = v.deadline;
                        contributedAmount = v.contributedAmount;
                        contributions = v.contributions;
                        refundBonusDeposit = v.refundBonusDeposit;
                        license = v.license;
                        imageUrl = v.imageUrl;
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
                    if (v.status == #SUCCEEDED) {
                        // run distribution routine
                        Debug.print("DISTRIBUTE THEM ALL!!!!111");
                    } else if (v.status == #OPEN) {
                        let crowdsale: Crowdsale = {
                            crowdsaleId = v.crowdsaleId;
                            creator = v.creator;
                            createdAt = v.createdAt;
                            updatedAt = Time.now();
                            status = #FAILED;
                            productType = v.productType;
                            offerPrice = v.offerPrice;
                            deadline = v.deadline;
                            contributedAmount = v.contributedAmount;
                            contributions = v.contributions;
                            refundBonusDeposit = v.refundBonusDeposit;
                            license = v.license;
                            imageUrl = v.imageUrl;
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
    public query func getAllContributionsByCrowdsaleId(id: CrowdsaleId) : async Result.Result<([CrowdsaleContribution]), Error> {
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
    public query(msg) func getContributionByCallerAndCrowdsaleId(id: CrowdsaleId) : async Result.Result<([CrowdsaleContribution]), Error> {
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
                #ok((c.contributions));
            };
        };
    };

    // retrieve crowdsale contributions by its id and principal
    public func getContributionByPrincipalAndCrowdsaleId(id: CrowdsaleId, callerId: Principal) : async Result.Result<([CrowdsaleContribution]), Error> {
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
                #ok((c.contributions));
            };
        };
    };

    // retrieve all created crowdsales
    public query(msg) func getAllCrowdsales() : async [Crowdsale] {
        let result = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        return result;
    };

    // retrieve all crowdsales by status
    public query(msg) func getCrowdsalesByStatus(status: Status) : async [Crowdsale] {
        let caller = msg.caller;
        let allCrowdsales = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        var result: [Crowdsale] = [];
        for (i in Iter.range(0, allCrowdsales.size() - 1)) {
            switch (allCrowdsales[i]) {
                case (crowdsale) {
                    if (crowdsale.status == status) {
                        result := Array.append<Crowdsale>(result, [crowdsale]);
                    };
                };
            };
        };
        result;
    };

    // retrieve current or expired crowdsales
    public query(msg) func getCrowdsalesByExpiration(isExpired: Bool) : async [Crowdsale] {
        let caller = msg.caller;
        let now = Time.now();
        let allCrowdsales = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        var result: [Crowdsale] = [];
        for (i in Iter.range(0, allCrowdsales.size() - 1)) {
            switch (allCrowdsales[i]) {
                case (crowdsale) {
                    if (isExpired == true) {
                        if (now >= crowdsale.deadline) {
                            result := Array.append<Crowdsale>(result, [crowdsale]);
                        };
                    } else {
                        if (now < crowdsale.deadline) {
                            result := Array.append<Crowdsale>(result, [crowdsale]);
                        };
                    }
                };
            };
        };
        result;
    };

    // retrieve all created crowdsales by caller
    public query(msg) func getCrowdsalesByCaller() : async [Crowdsale] {
        let caller = msg.caller;
        let allCrowdsales = Trie.toArray<CrowdsaleId, Crowdsale, Crowdsale>(crowdsales, transform);
        var result: [Crowdsale] = [];
        for (i in Iter.range(0, allCrowdsales.size() - 1)) {
            switch (allCrowdsales[i]) {
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
            switch (allCrowdsales[i]) {
                case (crowdsale) {
                    if (crowdsale.creator == creator) {
                        result := Array.append<Crowdsale>(result, [crowdsale]);
                    };
                };
            };
        };
        result;
    };

    // calculate results
    public shared(msg) func calculateResults(crowdsaleId: CrowdsaleId) : async Result.Result<CrowdsaleOvershootShare, Error> {
        let CREATOR_OVERSHOOT_SHARE = 0.5;
        let CONTRIBUTOR_OVERSHOOT_SHARE = 0.5;
        let PLATFORM_OVERSHOOT_SHARE = 0.05;
        var CROWDSALE_STATUS : Status = #OPEN;
        var contributorsContributionsAll : Trie.Trie<UserId, Float> = Trie.empty();
        var contributorsPayout : Trie.Trie<UserId, Float> = Trie.empty();
        var contributorsRefundBonus : Trie.Trie<UserId, Float> = Trie.empty();
        let callerId = msg.caller;
        let result = Trie.find(
            crowdsales,
            key(crowdsaleId),
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

                // load crowdsale contributions
                var crowdsaleContributions: [CrowdsaleContribution] = v.contributions; 

                // initialize variables
                let REFUND_BONUS_DEPOSIT = v.refundBonusDeposit;
                var CREATOR_REFUND_BONUS = 0.0;
                var CONTRIBUTORS_REFUND_BONUS = 0.0;
                let REFUND_BONUS_RATE = REFUND_BONUS_DEPOSIT / v.offerPrice;

                // calculate overshoot
                var overshoot = v.contributedAmount - v.offerPrice;

                // define the status of the crowdsale
                if (overshoot >= 0) {
                    CROWDSALE_STATUS := #SUCCEEDED;
                } else {
                    CROWDSALE_STATUS := #FAILED;
                    overshoot := 0;
                };

                // calculate overshoot rebate
                var platformOvershootShare = v.contributedAmount * PLATFORM_OVERSHOOT_SHARE;

                // set overshoot condition for a platform
                if (platformOvershootShare > overshoot) {
                    platformOvershootShare := overshoot;
                };

                // calculate overshoot sharing
                let OVERSHOOT_SHARE_TO_CONTRIBUTORS = (overshoot - platformOvershootShare) * CONTRIBUTOR_OVERSHOOT_SHARE;
                let OVERSHOOT_SHARE_TO_CREATOR = (overshoot - platformOvershootShare) * CREATOR_OVERSHOOT_SHARE;

                // calculate all contributions per contributor
                for (i in Iter.range(0, crowdsaleContributions.size() - 1)) {
                    let foundContributions = Trie.find(
                        contributorsContributionsAll,
                        keyPrincipal(crowdsaleContributions[i].contributor),
                        Principal.equal
                    );
                    switch (foundContributions) {
                        case null {
                            let (newContributions, _) = Trie.put(
                                contributorsContributionsAll,
                                keyPrincipal(crowdsaleContributions[i].contributor),
                                Principal.equal,
                                crowdsaleContributions[i].amount
                            );
                            contributorsContributionsAll := newContributions;
                        };
                        case (? c) {
                            let (newContributions, _) = Trie.put(
                                contributorsContributionsAll,
                                keyPrincipal(crowdsaleContributions[i].contributor),
                                Principal.equal,
                                c + crowdsaleContributions[i].amount
                            );
                            contributorsContributionsAll := newContributions;
                        };
                    };
                };

                // calculate refund bonuses
                if (CROWDSALE_STATUS == #SUCCEEDED) {
                    CONTRIBUTORS_REFUND_BONUS := 0;
                } else {
                    CONTRIBUTORS_REFUND_BONUS := v.contributedAmount * REFUND_BONUS_RATE;
                  
                    // calculate total refund bonuses for all contributors
                    for ((key, value) in Trie.iter(contributorsContributionsAll)) {
                        let (newContributorsRefundBonus, _) = Trie.put(
                            contributorsRefundBonus,
                            keyPrincipal(key),
                            Principal.equal,
                            value * REFUND_BONUS_RATE
                        );
                        contributorsRefundBonus := newContributorsRefundBonus;
                    };
                };

                CREATOR_REFUND_BONUS := REFUND_BONUS_DEPOSIT - CONTRIBUTORS_REFUND_BONUS;
                var creatorAmountToPayTotal = 0.0;
                var contributorsAmountToPayTotal = 0.0;

                // calculate total payouts for all contributors
                for ((key, value) in Trie.iter(contributorsContributionsAll)) {
                    var amountToPay = 0.0;
                    if (CROWDSALE_STATUS == #SUCCEEDED) {
                        amountToPay := value / v.contributedAmount * OVERSHOOT_SHARE_TO_CONTRIBUTORS;
                        creatorAmountToPayTotal := v.offerPrice + OVERSHOOT_SHARE_TO_CREATOR + CREATOR_REFUND_BONUS;
                        contributorsAmountToPayTotal := OVERSHOOT_SHARE_TO_CONTRIBUTORS;
                    } else {
                        amountToPay := value + value * REFUND_BONUS_RATE;
                        creatorAmountToPayTotal := CREATOR_REFUND_BONUS;
                        contributorsAmountToPayTotal := CONTRIBUTORS_REFUND_BONUS + v.contributedAmount;
                    };

                    let (newOvershootShareCalculated, _) = Trie.put(
                        contributorsPayout,
                        keyPrincipal(key),
                        Principal.equal,
                        amountToPay
                    );
                    contributorsPayout := newOvershootShareCalculated;
                };

                // fill in response
                let crowdsaleOvershootShare: CrowdsaleOvershootShare = {
                    crowdsaleId = crowdsaleId;
                    overshoot = overshoot;
                    platformOvershootShare = platformOvershootShare;
                    creatorOvershootShareTotal = OVERSHOOT_SHARE_TO_CREATOR;
                    creatorRefundBonus = CREATOR_REFUND_BONUS;
                    creatorPayoutTotal = creatorAmountToPayTotal;
                    contributorsContributionsAll = contributorsContributionsAll;
                    contributorsRefundBonusTotal = CONTRIBUTORS_REFUND_BONUS;
                    contributorsRefundBonusAll = contributorsRefundBonus;
                    contributorsPayout = contributorsPayout;
                    contributorsPayoutTotal = contributorsAmountToPayTotal;
                };
                #ok((crowdsaleOvershootShare));
            };
        };
    };

    public shared ({caller}) func createInvoice (args: Types.CreateInvoiceArgs) : async Types.CreateInvoiceResult {
        let id : Nat = invoiceCounter;
        invoiceCounter += 1;

        let destinationResult : Types.GetDestinationAccountIdentifierResult = getDestinationAccountIdentifier({ 
            token = args.token;
            invoiceId = id;
            caller 
        });

        switch (destinationResult) {
            case (#err result) {
                return #err({
                    message = ?"Invalid destination account identifier";
                    kind = #InvalidDestination;
                });
            };
            case (#ok result) {
                let destination : AccountIdentifier = result.accountIdentifier;
                let token = getTokenVerbose(args.token);
                let invoice : Invoice = {
                    id;
                    creator = caller;
                    details = args.details;
                    amount = args.amount;
                    amountPaid = 0;
                    token;
                    verifiedAtTime = null;
                    refundedAtTime = null;
                    paid = false;
                    refunded = false;
                    // 1 week in nanoseconds
                    expiration = Time.now() + (1000 * 60 * 60 * 24 * 7);
                    destination;
                    refundAccount = null;
                };
                invoices.put(id, invoice);
                return #ok({invoice});
            };
        };
    };

    func getTokenVerbose(token: Token) : TokenVerbose { 
        switch (token.symbol){
            case ("ICP") {
                return {
                    symbol = "ICP";
                    decimals = 8;
                    meta = ?{
                        Issuer = "e8s";
                    }
                };
            };
            case (_) {
                return {
                    symbol = "";
                    decimals = 1;
                    meta = ?{
                        Issuer = "";
                    }
                }
            };
        };
    };

    func getDestinationAccountIdentifier (args: Types.GetDestinationAccountIdentifierArgs) : Types.GetDestinationAccountIdentifierResult {
        let token = args.token;
        switch (token.symbol) {
            case ("ICP") {
                let canisterId = Principal.fromActor(this);
                let account = U.getICPAccountIdentifier({
                    principal = canisterId;
                    subaccount = U.generateInvoiceSubaccount({ 
                        caller = args.caller;
                        id = args.invoiceId;
                    });
                });
                let hexEncoded = Hex.encode(Blob.toArray(account));
                let result: AccountIdentifier = #text(hexEncoded);
                return #ok({accountIdentifier = result});
            };
            case (_) {
                return #err({
                    message = ?"This token is not yet supported. Currently, this canister supports ICP.";
                    kind = #InvalidToken;
                });
            };
        };
    };

    public func getInvoice (args: Types.GetInvoiceArgs) : async Types.GetInvoiceResult {
        let invoice = invoices.get(args.id);
        switch (invoice) {
            case (null) {
                return #err({
                    message = ?"Invoice not found";
                    kind = #NotFound;
                });
            };
            case (? i){
                return #ok({invoice = i});
            };
        };
    };

    public shared ({caller}) func getBalance (args: Types.GetBalanceArgs) : async Types.GetBalanceResult {
        let token = args.token;
        let canisterId = Principal.fromActor(this);
        switch (token.symbol){
            case ("ICP"){
                let defaultAccount = Hex.encode(
                    Blob.toArray(
                        U.getDefaultAccount({
                            canisterId;
                            principal = caller;
                        })
                    )
                );
                let balance = await ICP.balance({account = defaultAccount});
                switch (balance){
                    case (#err err){
                        return #err({
                            message = ?"Could not get balance";
                            kind = #NotFound;
                        });
                    };
                    case (#ok result){
                        return #ok({balance = result.balance});
                    };
                };
            };
            case (_){
                return #err({
                    message = ?"This token is not yet supported. Currently, this canister supports ICP.";
                    kind = #InvalidToken;
                });
            };
        };
    };

    public shared ({caller}) func verifyInvoice (args: Types.VerifyInvoiceArgs) : async Types.VerifyInvoiceResult {
        let invoice = invoices.get(args.id);
        let canisterId = Principal.fromActor(this);

        switch (invoice){
            case (null){
                return #err({
                    message = ?"Invoice not found";
                    kind = #NotFound;
                });
            };
            case (? i){
                // Return if already verified
                if (i.verifiedAtTime != null){
                    return #ok(#AlreadyVerified{
                        invoice = i;
                    });
                };

                switch (i.token.symbol){
                    case ("ICP"){
                        let result: Types.VerifyInvoiceResult = await ICP.verifyInvoice({
                            invoice = i;
                            caller;
                            canisterId;
                        });
                        switch (result){
                            case (#ok value){
                                switch (value){
                                    case (#AlreadyVerified _){};
                                    case (#Paid paidResult){
                                        let replaced = invoices.replace(i.id, paidResult.invoice);
                                    };
                                };
                            };
                            case (#err _){};
                        };
                        return result;
                    };
                    case (_){
                        return #err({
                            message = ?"This token is not yet supported. Currently, this canister supports ICP.";
                            kind = #InvalidToken;
                        });
                    };
                };
            };
        };
    };

    public shared ({caller}) func refundInvoice (args : Types.RefundInvoiceArgs) : async Types.RefundInvoiceResult {
        let canisterId = Principal.fromActor(this);
        let invoice = invoices.get(args.id);
        let accountResult = U.accountIdentifierToBlob({
            accountIdentifier = args.refundAccount;
            canisterId = ?canisterId;
        });
        switch (accountResult){
            case (#err err){
                return #err({
                    message = err.message;
                    kind = #InvalidDestination;
                });
            };
            case (#ok destination){
                let invoice = invoices.get(args.id);
                switch (invoice){
                    case (null){
                        return #err({
                            message = ?"Invoice not found";
                            kind = #NotFound;
                        });
                    };
                    case (? i){
                        // Return if already refunded
                        if (i.refundedAtTime != null){
                            return #err({
                                message = ?"Invoice already refunded";
                                kind = #AlreadyRefunded;
                            });
                        };
                        switch (i.token.symbol){
                            case ("ICP"){
                                let transferResult = await ICP.transfer({
                                    memo = 0;
                                    fee = {
                                        e8s = 10000;
                                    };
                                    amount = {
                                        // Total amount, minus the fee
                                        e8s = Nat64.sub(Nat64.fromNat(args.amount), 10000);
                                    };
                                    from_subaccount = ?A.principalToSubaccount(caller);
                                    to = destination;
                                    created_at_time = null;
                                });
                                switch (transferResult) {
                                    case (#ok result) {
                                        let updatedInvoice = {
                                            id = i.id;
                                            creator = i.creator;
                                            details = i.details;
                                            amount = i.amount;
                                            amountPaid = i.amountPaid;
                                            token = i.token;
                                            verifiedAtTime = i.verifiedAtTime;
                                            refundedAtTime = ?Time.now();
                                            paid = i.paid;
                                            refunded = true;
                                            expiration = i.expiration;
                                            destination = i.destination;
                                            refundAccount = ?#blob(destination);
                                        };
                                        let replaced = invoices.put(i.id, updatedInvoice);
                                        return #ok(result);
                                    };
                                    case (#err err) {
                                        switch (err.kind){
                                            case (#BadFee f){
                                                return #err({
                                                    message = err.message;
                                                    kind = #BadFee;
                                                });
                                            };
                                            case (#InsufficientFunds f){
                                                return #err({
                                                    message = err.message;
                                                    kind = #InsufficientFunds;
                                                });
                                            };
                                            case (_){
                                                return #err({
                                                    message = err.message;
                                                    kind = #Other;
                                                });
                                            }
                                        };
                                    };
                                };
                            };
                            case (_){
                                return #err({
                                    message = ?"This token is not yet supported. Currently, this canister supports ICP.";
                                    kind = #InvalidToken;
                                });
                            };
                        }
                    };
                };
            };
        };
    };

    public shared ({caller}) func transfer (args: Types.TransferArgs) : async Types.TransferResult {
        let token = args.token;
        let accountResult = U.accountIdentifierToBlob({
            accountIdentifier = args.destination;
            canisterId = ?Principal.fromActor(this);
        });
        switch (accountResult) {
            case (#err err) {
                return #err({
                    message = err.message;
                    kind = #InvalidDestination;
                });
            };
            case (#ok destination) {
                switch (token.symbol) {
                    case ("ICP") {
                        let now = Nat64.fromIntWrap(Time.now());
                        let transferResult = await ICP.transfer({
                            memo = 0;
                            fee = {
                                e8s = 10000;
                            };
                            amount = {
                                // Total amount, minus the fee
                                e8s = Nat64.sub(Nat64.fromNat(args.amount), 10000);
                            };
                            from_subaccount = ?A.principalToSubaccount(caller);
                            to = destination;
                            created_at_time = null;
                        });
                        switch (transferResult) {
                            case (#ok result) {
                                return #ok(result);
                            };
                            case (#err err) {
                                switch (err.kind) {
                                    case (#BadFee _) {
                                        return #err({
                                            message = err.message;
                                            kind = #BadFee;
                                        });
                                    };
                                    case (#InsufficientFunds _) {
                                        return #err({
                                            message = err.message;
                                            kind = #InsufficientFunds;
                                        });
                                    };
                                    case (_) {
                                        return #err({
                                            message = err.message;
                                            kind = #Other;
                                        });
                                    }
                                };
                            };
                        };
                    };
                    case (_) {
                        return #err({
                            message = ?"Token not supported";
                            kind = #InvalidToken;
                        });
                    };
                };
            };
        };
    };

    /*
        * Get Caller Identifier
        * Allows a caller to the accountIdentifier for a given principal
        * for a specific token.
    */
    public query func getAccountIdentifier (args: Types.GetAccountIdentifierArgs) : async Types.GetAccountIdentifierResult {
        let token = args.token;
        let principal = args.principal;
        let canisterId = Principal.fromActor(this);
        switch (token.symbol) {
            case ("ICP") {
                let subaccount = U.getDefaultAccount({principal; canisterId;});
                let hexEncoded = Hex.encode(
                    Blob.toArray(subaccount)
                );
                let result: AccountIdentifier = #text(hexEncoded);
                return #ok({accountIdentifier = result});
            };
            case (_) {
                return #err({
                    message = ?"This token is not yet supported. Currently, this canister supports ICP.";
                    kind = #InvalidToken;
                });
            };
        };
    };

    public query func remainingCycles() : async Nat {
        return Cycles.balance()
    };

    public func accountIdentifierToBlob (accountIdentifier: AccountIdentifier) : async Types.AccountIdentifierToBlobResult {
        return U.accountIdentifierToBlob({
            accountIdentifier;
            canisterId = ?Principal.fromActor(this);
        });
    };

    system func preupgrade() {
        entries := Iter.toArray(invoices.entries());
    };

    system func postupgrade() {
        invoices := HashMap.fromIter(Iter.fromArray(entries), 16, Nat.equal, Hash.hash);
        entries := [];
    };

    // erase everything
    public shared(msg) func eraseDatabase() : async Result.Result<(Text), Error> {
        let callerId = msg.caller;
        if (admin != callerId) {
            throw Err.reject("No access");
        } else {
            crowdsales := Trie.empty();
            #ok(("ok"));
        };
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

    public func id() : async Principal {
        return await whoami();
    };

    public shared (msg) func whoamiText() : async Text {
        let caller = msg.caller;
        let identity = Principal.toText(caller);
        return "My identity is : " # identity # "!";
    };
};