// Import base modules
import Bool "mo:base/Bool";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Prelude "mo:base/Prelude";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import TrieMap "mo:base/TrieMap";
import Types "./types";

shared (msg) actor class crowdsale (){
    let admin = msg.caller;
    var state = Types.empty();

    public type Crowdsale = Types.Crowdsale;
    public type CrowdsaleId = Types.CrowdsaleId;
    public type UserId = Types.UserId;
    public type Status = Types.Status;

    public shared query(msg) func getOwnId() : async UserId { admin };

    func _createCrowdsale(name: Text, creator: UserId, offerPrice: Int, deadline: Int) : ?CrowdsaleId {
        let now = Time.now();
        let crowdsaleId = Principal.toText(creator) # "-" # name # "-" # (Int.toText(now));
        switch (state.crowdsales.get(crowdsaleId)) {
            case (?_) { null };
            case null {
                state.crowdsales.put(crowdsaleId,
                                    {
                                        crowdsaleId = crowdsaleId;
                                        name = name;
                                        creator = creator;
                                        status = #open;
                                        createdAt = now;
                                        updatedAt = now;
                                        offerPrice = offerPrice;
                                        deadline = deadline;
                                        contributedAmount = 0;
                                    });
                    ?crowdsaleId
            };
        }
    };

    public shared(msg) func createCrowdsale(name: Text, offerPrice: Int, deadline: Int) : async ?CrowdsaleId {
        _createCrowdsale(name, msg.caller, offerPrice, deadline);
    };

    /** doesn't work yet
    func _updateCrowdsale(crowdsaleId: CrowdsaleId, name: Text, offerPrice: Int, deadline: Int) : ?CrowdsaleId {
        let now = Time.now();
        do ? {
            let v = state.crowdsales.get(crowdsaleId)!;
            var _name = v.name;
            var _offerPrice = v.offerPrice;
            var _deadline = v.deadline;
            if (name != "") { 
                _name := name; 
            };
            if (offerPrice != 0) { 
                _offerPrice := offerPrice; 
            };
            if (deadline != 0) { 
                _deadline := deadline; 
            };
            switch (v) {
                case (?v) {
                    state.crowdsales.put(crowdsaleId,
                                        {
                                            crowdsaleId = crowdsaleId;
                                            name = _name;
                                            creator = v.creator;
                                            status = v.status;
                                            createdAt = v.createdAt;
                                            updatedAt = now;
                                            offerPrice = _offerPrice;
                                            deadline = _deadline;
                                            contributedAmount = v.contributedAmount;
                                        });
                };
                case (null) { null; }
            }
        }
    };**/

    func _getCrowdsaleInfo(crowdsaleId: CrowdsaleId) : ?Crowdsale {
        do ? {
            let v = state.crowdsales.get(crowdsaleId)!;
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
        }
    };

    public query(msg) func getCrowdsaleInfo(crowdsaleId: CrowdsaleId) : async ?Crowdsale {
        _getCrowdsaleInfo(crowdsaleId);
    };

    public query(msg) func getAllCrowdsales() : async ?[Crowdsale] {
        do ? {
            let b = Buffer.Buffer<Crowdsale>(0);
            for ((v, _) in state.crowdsales.entries()) {
                let crowdsaleInfo = _getCrowdsaleInfo(v)!;
                // to-do security
                b.add(crowdsaleInfo);
            };
            b.toArray()
        }
    };
   

    /**
    public shared(msg) func changeCrowdsaleStatus(crowdsaleId: CrowdsaleId, status: Status) : async ?Crowdsale {
        var v = state.crowdsales.get(crowdsaleId);
        // v.status := status;
        let crowdsale = state.crowdsales.replace(
            crowdsaleId,
            v
        );
        return crowdsale;
    };*/
};