import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Bool "mo:base/Int";
import Nat8 "mo:base/Nat8";
import TrieMap "mo:base/TrieMap";

// get crowdsales by principal

module {
    public type UserId = Principal;
    public type CrowdsaleId = Text;
    public type Status = { #open; #closed; #failed; #fullfilled; };

    public type Crowdsale = {
        crowdsaleId: CrowdsaleId;
        name: Text;
        creator: UserId;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        status: Status;
        // only can decrease
        offerPrice: Int;
        deadline: Time.Time;
        // contributor can increase
        contributedAmount: Int;
    };

    public type CrowdsaleCreate = {
        name: Text;
        offerPrice: Int;
        deadline: Time.Time;
    };

    public type CrowdsaleUpdate = {
        crowdsaleId: CrowdsaleId;
        name: Text;
        status: Status;
        offerPrice: Int;
        deadline: Time.Time;
        contributedAmount: Int;
    };

    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };
}