import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Trie "mo:base/Trie";
import HashMap "mo:base/HashMap";
import Xtc "./xtc";

module {
    public type UserId = Principal;
    public type CrowdsaleId = Text;
    public type Status = { #open; #closed; #failed; #fulfilled; };

    public type Crowdsale = {
        crowdsaleId: CrowdsaleId;
        creator: UserId;
        createdAt: Time.Time;
        updatedAt: Time.Time;
        status: Status;
        offerPrice: Float;
        deadline: Time.Time;
        contributedAmount: Float;
        contributions: Trie.Trie<Principal, Float>;
        identity: Text;
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

    public type PrincipalToNatEntry = (Principal, Nat);
    public type PrincipalToNat = HashMap.HashMap<Principal, Nat>;

    public type Data = {
        projectId: Nat;
        details: ProjectDetails_v2;
        owners: [var Block];
        status: Status_v2;
        ownerIds: PrincipalToNat;
        events: [Event];
        transferCount: Nat;
    };

    public type ProjectDetails_v2 = {
        name: Text;
        description: Text;
        creator: Text;
        createdTime: Int;
        isActive: Bool;
    };

    public type SetDetailsRequest = {
        projectId: Nat;
        isActive: ?Bool;
        name: ?Text;
        description: ?Text;
        creator: ?Text;
        createdTime: ?Int;
    };

    public type Block = {
        id: Nat;
        owner: Principal;
        lastPurchasePrice: Int;
        lastSalePrice: Int;
        lastSaleTime: Int;
        totalOwnedTime: Int;
        totalSaleCount: Nat;
        totalValue: Nat;
    };

    public type Status_v2 = {
        isForeclosed: Bool;
        owner: Principal;
        offerTimestamp: Int;
        offerValue: Nat;
    };

    public type Event = {
        id: Nat;
        timestamp: Int;
        data: {
            #Transfer: TransferEvent;
            #PriceChange: PriceChange;
        }
    };

    public type TransferEvent = {
        from: Principal;
        to: Principal;
        value: Nat;
    };

    public type PriceChange = {
        owner: Principal;
        from: Nat;
        to: Nat;
    };

    public type Canisters = {
        xtc: Principal;
    };

    public type Initialization = {
        controller: Principal;
        canisters: Canisters;
    };

    public type Info = {
        projectCount: Nat;
        stats: {
            xtcBalance: Nat;
            cyclesBalance: Nat;
            cubesSupply: Nat;
            ownCubesBalance: Nat;
            feesCollected: Nat;
            taxCollected: Nat;
            transactionsCount: Nat;
            foreclosureCount: Nat;
            salesTotal: Nat;
            transactionFee: Nat;
            annualTaxRate: Nat;
            lastTaxTimestamp: Int;
        };
        canisters: Canisters;
        controllers: [Principal];
    };

    public type BlocksRequest = {
        projectId: Nat;
        orderBy: {
            #id;
            #lastPurchasePrice;
            #lastSalePrice;
            #lastSaleTime;
            #totalSaleCount;
            #totalOwnedTime;
            #totalValue;
        };
        order: { #asc; #desc };
    };

    public type HistoryRequest = {
        projectId: Nat;
        principal: ?Principal;
    };

    public type HistoryResponse = {
        events: [Event];
        count: Nat;
    };
}