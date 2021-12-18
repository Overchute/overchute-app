import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Trie "mo:base/Trie";

module {
    public type UserId = Principal;
    public type CrowdsaleId = Text;
    public type Status = { #OPEN; #CLOSED; #FAILED; #SUCCEEDED; };

    public type Crowdsale = {
        crowdsaleId: CrowdsaleId;
        creator: UserId;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        status: Status;
        offerPrice: Float;
        deadline: Time.Time;
        contributedAmount: Float;
        contributions: [CrowdsaleContribution];
        identity: Text;
    };

    public type CrowdsaleContribution = {
        crowdsaleId: CrowdsaleId;
        contributor: UserId;
        amount: Float;
        date: Time.Time;
    };

    public type CrowdsaleRewards = {
        crowdsaleId: CrowdsaleId;
        overshoot: Float;
        platformRewards: Float;
        creatorRewardsTotal: Float;
        creatorPayoutTotal: Float;
        // sum of all contributions of each contributor
        contributorsContributionsAll: Trie.Trie<Principal, Float>;
        contributorsPayout: Trie.Trie<Principal, Float>;
        // how much do we need to pay to contributors
        contributorsPayoutTotal: Float;
    };

    public type CrowdsaleCreate = {
        offerPrice: Float;
        deadline: Time.Time;
    };

    public type CrowdsaleUpdate = {
        crowdsaleId: CrowdsaleId;
        offerPrice: Float;
        deadline: Time.Time;
    };

    public type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
    };
}