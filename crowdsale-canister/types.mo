import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Int";
import Nat8 "mo:base/Nat8";
import TrieMap "mo:base/TrieMap";

module {
    public type UserId = Principal;
    public type CrowdsaleId = Text;
    public type Map<X, Y> = TrieMap.TrieMap<X, Y>;
    public type Status = { #open; #closed; #failed; #fullfilled; };

    public type Crowdsale = {
        crowdsaleId: CrowdsaleId;
        name: Text;
        creator: UserId;
        createdAt: Int;
        updatedAt: Int;
        status: Status;
        offerPrice: Int;
        deadline: Int;
        contributedAmount: Int;
    };

    public type State = {
        /// all crowdsales.
        crowdsales: Map<CrowdsaleId, Crowdsale>;
    };

    public func empty () : State {
        let st : State = {
            crowdsales = TrieMap.TrieMap<CrowdsaleId, Crowdsale>(Text.equal, Text.hash);
        };
    };
}