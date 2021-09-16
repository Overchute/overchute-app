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

shared (msg) actor class crowdsale (){
    private let admin = msg.caller;

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
        let id = Principal.toText(callerId) # "-" # crowdsaleCreate.name #  "-" # (Int.toText(now));

        let crowdsale: Crowdsale = {
            crowdsaleId = id;
            name = crowdsaleCreate.name;
            creator = callerId;
            createdAt = 0;
            updatedAt = 0;
            status = #open;
            offerPrice = crowdsaleCreate.offerPrice;
            deadline = crowdsaleCreate.deadline;
            contributedAmount = 0;
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
        let result = Trie.find(
            crowdsales,
            key(crowdsaleUpdate.crowdsaleId),
            Text.equal
        );

        let crowdsale: Crowdsale = {
            crowdsaleId = crowdsaleUpdate.crowdsaleId;
            name = crowdsaleUpdate.name;
            // creator = result.creator;
            // createdAt = result.createdAt;
            creator = msg.caller;
            createdAt = 0;
            updatedAt = 0;
            status = crowdsaleUpdate.status;
            offerPrice = crowdsaleUpdate.offerPrice;
            deadline = crowdsaleUpdate.deadline;
            contributedAmount = crowdsaleUpdate.contributedAmount;
        };

        switch (result) {
            case null {
                #err(#NotFound);
            };
            case (? v) {
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

    // public query(msg) func getAllCrowdsales() : async Result.Result<[Crowdsale], Error> {
    //     let allCrowdsales = Trie.find(
    //         crowdsales,
    //         key()
    //     )
    // };

    /*func getCrowdsaleInfo(crowdsaleId: CrowdsaleId) : Crowdsale {
        let v = crowdsales.get(crowdsaleId);
        {
            crowdsaleId = crowdsaleId;
            name = v.name;
            creator = v.creator;
            createdAt = v.createdAt;
            updatedAt = v.updatedAt;
            status = v.status;
            offerPrice = v.offerPrice;
            deadline = v.deadline;
            contributedAmount = v.contributedAmount;
        }
    };*/

    private func key(x : Text) : Trie.Key<CrowdsaleId> {
        return { key = x; hash = Text.hash(x) }
    };
};