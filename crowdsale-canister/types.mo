import Time "mo:base/Time";
import Blob "mo:base/Blob";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Trie "mo:base/Trie";
import Result "mo:base/Result";

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

    public type Token = {
        symbol: Text;
    };

    public type TokenVerbose = {
        symbol: Text;
        decimals: Int;
        meta: ?{
            Issuer: Text;
        };
    };

    public type AccountIdentifier = {
        #text: Text;
        #principal: Principal;
        #blob: Blob;
    };

    public type Details = {
        description: Text;
        meta: Blob;
    };

    public type Invoice = {
        id: Nat;
        creator: Principal;
        details: ?Details;
        amount: Nat;
        amountPaid: Nat;
        token: TokenVerbose;
        verifiedAtTime: ?Time.Time;
        refundedAtTime: ?Time.Time;
        paid: Bool;
        refunded: Bool;
        expiration: Time.Time;
        destination: AccountIdentifier;
        refundAccount: ?AccountIdentifier;
    };

    /**
    * Service Args and Result Types
    */  

    public type CreateInvoiceArgs = {
        amount: Nat;
        token: Token;
        details: ?Details;
    };

    public type CreateInvoiceResult = Result.Result<CreateInvoiceSuccess, CreateInvoiceErr>;

    public type CreateInvoiceSuccess = {
        invoice: Invoice;
    };

    public type CreateInvoiceErr = {
        message: ?Text; 
        kind: {
            #InvalidToken;
            #InvalidAmount;
            #InvalidDestination;
            #InvalidDetails;
            #Other;
        };
    };

    public type GetDestinationAccountIdentifierArgs = {
        token : Token;
        caller : Principal;
        invoiceId : Nat;
    };

    public type GetDestinationAccountIdentifierResult = Result.Result<GetDestinationAccountIdentifierSuccess, GetDestinationAccountIdentifierErr>;

    public type GetDestinationAccountIdentifierSuccess = {
        accountIdentifier: AccountIdentifier;
    };

    public type GetDestinationAccountIdentifierErr = {
        message: ?Text; 
        kind: {
            #InvalidToken;
            #InvalidInvoiceId;
            #Other;
        };
    };

    public type GetInvoiceArgs = {
        id: Nat;
    };

    public type GetInvoiceResult = Result.Result<GetInvoiceSuccess, GetInvoiceErr>;

    public type GetInvoiceSuccess = {
        invoice: Invoice;
    };

    public type GetInvoiceErr = {
        message: ?Text; 
        kind: {
            #InvalidInvoiceId;
            #NotFound;
            #Other;
        };
    };

    public type GetBalanceArgs = {
        token: Token;
    };

    public type GetBalanceResult = Result.Result<GetBalanceSuccess, GetBalanceErr>;

    public type GetBalanceSuccess = {
        balance: Nat;
    };

    public type GetBalanceErr = {
        message: ?Text; 
        kind: {
            #InvalidToken;
            #NotFound;
            #Other;
        };
    };

    public type VerifyInvoiceArgs = {
        id: Nat;
    };

    public type VerifyInvoiceResult = Result.Result<VerifyInvoiceSuccess, VerifyInvoiceErr>;

    public type VerifyInvoiceSuccess = {
        #Paid: {
            invoice: Invoice;
        };
        #AlreadyVerified: {
            invoice: Invoice;
        };
    };

    type VerifyInvoiceErr = {
        message: ?Text; 
        kind: {
            #InvalidInvoiceId;
            #NotFound;
            #NotYetPaid;
            #Expired;
            #TransferError;
            #InvalidToken;
            #InvalidAccount;
            #Other;
        };
    };

    public type TransferArgs = {
        amount: Nat;
        token: Token;
        destination: AccountIdentifier;
    };

    public type TransferResult = Result.Result<TransferSuccess, TransferError>;

    public type TransferSuccess = {
        blockHeight: Nat64;
    };

    public type TransferError = {
        message: ?Text; 
        kind: {
            #BadFee;
            #InsufficientFunds;
            #InvalidToken;
            #InvalidDestination;
            #Other;
        };
    };

    public type GetAccountIdentifierArgs = {
        token : Token;
        principal : Principal;
    };

    public type GetAccountIdentifierResult = Result.Result<GetAccountIdentifierSuccess, GetAccountIdentifierErr>;

    public type GetAccountIdentifierSuccess = {
        accountIdentifier: AccountIdentifier;
    };

    public type GetAccountIdentifierErr = {
        message: ?Text; 
        kind: {
            #InvalidToken;
            #Other;
        };
    };

    public type RefundInvoiceArgs = {
        id: Nat;
        refundAccount: AccountIdentifier;
        amount: Nat;
    };

    public type RefundInvoiceResult = Result.Result<RefundInvoiceSuccess, RefundInvoiceErr>;

    public type RefundInvoiceSuccess = {
        blockHeight: Nat64;
    };

    public type RefundInvoiceErr = {
        message: ?Text; 
        kind: {
            #InvalidInvoiceId;
            #NotFound;
            #NotYetPaid;
            #InvalidDestination;
            #TransferError;
            #InsufficientFunds;
            #InvalidToken;
            #AlreadyRefunded;
            #BadFee;
            #Other;
        };
    };

    public type AccountIdentifierToBlobArgs = {
        accountIdentifier: AccountIdentifier;
        canisterId: ?Principal;
    };
    
    public type AccountIdentifierToBlobResult = Result.Result<AccountIdentifierToBlobSuccess, AccountIdentifierToBlobErr>;
    public type AccountIdentifierToBlobSuccess = Blob;

    public type AccountIdentifierToBlobErr = {
        message: ?Text; 
        kind: {
            #InvalidAccountIdentifier;
            #Other;
        };
    };

    public type AccountIdentifierToTextArgs = {
        accountIdentifier: AccountIdentifier;
        canisterId: ?Principal;
    };

    public type AccountIdentifierToTextResult = Result.Result<AccountIdentifierToTextSuccess, AccountIdentifierToTextErr>;
    public type AccountIdentifierToTextSuccess = Text;
    public type AccountIdentifierToTextErr = {
        message: ?Text; 
        kind: {
            #InvalidAccountIdentifier;
            #Other;
        };
    };

    public type Memo = Nat64;
    public type SubAccount = Blob;

    public type TimeStamp = {
        timestamp_nanos: Nat64;
    };

    public type ICPTokens = {
        e8s : Nat64;
    };

    public type ICPTransferError = {
        message: ?Text;
        kind : {
            #BadFee: {
                expected_fee: ICPTokens;
            };
            #InsufficientFunds: {
                balance: ICPTokens;
            };
            #TxTooOld: {
                allowed_window_nanos: Nat64;
            };
            #TxCreatedInFuture;
            #TxDuplicate : {
                duplicate_of: Nat;
            };
            #Other;
        }
    };

    public type ICPTransferArgs = {
        memo: Memo;
        amount: ICPTokens;
        fee: ICPTokens;
        from_subaccount: ?SubAccount;
        to: AccountIdentifier;
        created_at_time: ?TimeStamp;
    };

    public type ICPTransferResult = Result.Result<TransferSuccess, ICPTransferError>;
}