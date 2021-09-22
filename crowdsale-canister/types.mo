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
    public type Status = { #open; #closed; #failed; #fullfilled; };

    public type Crowdsale = {
        crowdsaleId: CrowdsaleId;
        creator: UserId;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        status: Status;
        offerPrice: Int;
        deadline: Time.Time;
        contributedAmount: Int;
    };

    public type CrowdsaleCreate = {
        offerPrice: Int;
        deadline: Time.Time;
    };

    public type CrowdsaleUpdate = {
        crowdsaleId: CrowdsaleId;
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