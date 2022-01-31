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
        productType: ProductType;
        offerPrice: Float;
        deadline: Time.Time;
        contributedAmount: Float;
        contributions: [CrowdsaleContribution];
        refundBonusDeposit: Float;
        license: Int;
        imageUrl: ?Text;
        identity: Text;
    };

    public type ProductType = { #SOURCE_CODE; };

    public type CrowdsaleContribution = {
        crowdsaleId: CrowdsaleId;
        contributor: UserId;
        amount: Float;
        date: Time.Time;
    };

    public type CrowdsaleOvershootShare = {
        crowdsaleId: CrowdsaleId;
        overshoot: Float;
        platformOvershootShare: Float;
        creatorOvershootShareTotal: Float;
        creatorRefundBonus: Float;
        creatorPayoutTotal: Float;
        contributorsContributionsAll: Trie.Trie<Principal, Float>;
        contributorsRefundBonusTotal: Float;
        contributorsRefundBonusAll: Trie.Trie<Principal, Float>;
        contributorsPayout: Trie.Trie<Principal, Float>;
        contributorsPayoutTotal: Float;
    };

    public type CrowdsaleCreate = {
        offerPrice: Float;
        deadline: Time.Time;
        productType: ProductType;
        refundBonusDeposit: Float;
        license: Int;
        imageUrl: ?Text;
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