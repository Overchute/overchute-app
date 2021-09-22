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

shared (msg) actor class crowdsale (){
    private let admin = msg.caller;
    private let g = UUID.Generator();

    public type Crowdsale = Types.Crowdsale;
    public type CrowdsaleCreate = Types.CrowdsaleCreate;
    public type CrowdsaleUpdate = Types.CrowdsaleUpdate;
    public type CrowdsaleId = Types.CrowdsaleId;
    public type UserId = Types.UserId;
    public type Status = Types.Status;
    public type Error = Types.Error;

    private stable var crowdsales : Trie.Trie<CrowdsaleId, Crowdsale> = Trie.empty();

    public shared query(msg) func getOwnId() : async UserId { admin };

    // create crowdsale
    public shared(msg) func createCrowdsale(crowdsaleCreate: CrowdsaleCreate) : async Result.Result<(Text), Error> {
        let now = Time.now();
        let callerId = msg.caller;
        let id = UUID.toText(g.new());        

        if (crowdsaleCreate.deadline <= now) {
            Debug.print(debug_show(now));
            throw Err.reject("Deadline can't be less than now");
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

    // todo
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
                // let (newCrowdsales, existing) = Trie.put(
                //     crowdsales,
                //     key(id),
                //     Text.equal,
                //     crowdsale
                // );
                let crowdsale: Crowdsale = {
                    crowdsaleId = v.crowdsaleId;
                    creator = v.creator;
                    createdAt = v.createdAt;
                    updatedAt = Time.now();
                    status = v.status;
                    offerPrice = v.offerPrice;
                    deadline = v.deadline;
                    contributedAmount = v.contributedAmount + amount;
                    contributions = v.contributions;
                };
                crowdsales := Trie.replace(
                    crowdsales,
                    key(v.crowdsaleId),
                    Text.equal,
                    ?crowdsale
                ).0;
                #ok((v.crowdsaleId));
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
};