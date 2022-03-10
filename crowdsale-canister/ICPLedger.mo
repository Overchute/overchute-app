import Ledger "canister:ledger";
import A "./account";
import CRC32 "./CRC32";
import Hex "./hex";
import SHA224 "./SHA224";
import T "./types";
import U "./utils";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
    public type Memo = Nat64;

    public type Tokens = {
      e8s : Nat64;
    };

    public type TimeStamp = {
      timestamp_nanos: Nat64;
    };

    public type AccountIdentifier = Blob;
    
    public type SubAccount = Blob;

    public type BlockIndex = Nat64;

    public type TransferError = {
      message: ?Text;
      kind : {
        #BadFee: {
          expected_fee: Tokens;
        };
        #InsufficientFunds: {
          balance: Tokens;
        };
        #TxTooOld: {
          allowed_window_nanos: Nat64;
        };
        #TxCreatedInFuture;
        #TxDuplicate : {
          duplicate_of: BlockIndex;
        };
        #Other;
      }
    };

    public type TransferArgs = {
      memo: Memo;
      amount: Tokens;
      fee: Tokens;
      from_subaccount: ?SubAccount;
      to: AccountIdentifier;
      created_at_time: ?TimeStamp;
    };

    public type TransferResult = Result.Result<T.TransferSuccess, TransferError>;

    public func transfer (args: TransferArgs) : async TransferResult {
      let result = await Ledger.transfer({
        memo = args.memo;
        amount = args.amount;
        fee = args.fee;
        from_subaccount = args.from_subaccount;
        to = args.to;
        created_at_time = args.created_at_time;
      });
      switch (result){
        case (#Ok index){
          return #ok({blockHeight = index});
        };
        case (#Err err){
          switch(err){
            case (#BadFee kind){
              let expected_fee = kind.expected_fee;
              return #err({
                message = Option.make("Bad Fee. Expected fee of " # Nat64.toText(expected_fee.e8s) # " but got " # Nat64.toText(args.fee.e8s));
                kind = #BadFee({expected_fee});
              });
            };
            case (#InsufficientFunds kind){
              let balance = kind.balance;
              return #err({
                message = Option.make("Insufficient balance. Current balance is " # Nat64.toText(balance.e8s));
                kind = #InsufficientFunds({balance});
              })
            };
            case (#TxTooOld kind){
              let allowed_window_nanos = kind.allowed_window_nanos;
              return #err({
                message = Option.make("Error - Tx Too Old. Allowed window of " # Nat64.toText(allowed_window_nanos));
                kind = #TxTooOld({allowed_window_nanos});
              })
            };
            case (#TxCreatedInFuture){
              return #err({
                message = ?"Error - Tx Created In Future";
                kind = #TxCreatedInFuture;
              })
            };
            case (#TxDuplicate kind){
              let duplicate_of = kind.duplicate_of;
              return #err({
                message = Option.make("Error - Duplicate transaction. Duplicate of " # Nat64.toText(duplicate_of));
                kind = #TxDuplicate({duplicate_of});
              })
            };
          };
        };
      };
    };

    type AccountArgs = {
      // Hex-encoded AccountIdentifier
      account : Text;
    };
    type BalanceResult = Result.Result<BalanceSuccess, BalanceError>;

    type BalanceSuccess = {
      balance: Nat;
    };
    type BalanceError = {
      message: ?Text; 
      kind: {
        #InvalidToken;
        #InvalidAccount;
        #NotFound;
        #Other;
      };
    };
    public func balance(args: AccountArgs) : async BalanceResult {
      switch (Hex.decode(args.account)){
        case (#err err){
          #err({
            kind = #InvalidAccount;
            message = ?"Invalid account";
          });
        };
        case (#ok account) {
          let balance = await Ledger.account_balance({account = Blob.fromArray(account)});
          #ok({
            balance = Nat64.toNat(balance.e8s);
          });
        };
      };
    };

    public type GetICPAccountIdentifierArgs = {
      principal : Principal;
      subaccount : SubAccount;
    };
    public func getICPAccountIdentifier(args: GetICPAccountIdentifierArgs) : Blob {
      A.accountIdentifier(args.principal, args.subaccount);
    };

    public type ICPVerifyInvoiceArgs = {
      invoice : T.Invoice;
      caller : Principal;
      canisterId : Principal;
    };
    public func verifyInvoice(args: ICPVerifyInvoiceArgs) : async T.VerifyInvoiceResult {
      let i = args.invoice;
      let destinationResult = U.accountIdentifierToText({
        accountIdentifier = i.destination;
        canisterId = ?args.canisterId;
      });
      switch (destinationResult) {
        case (#err err){
          return #err({
            kind = #InvalidAccount;
            message = ?"Invalid destination account";
          });
        };
        case (#ok destination){
          let balanceResult = await balance({account = destination});
          switch(balanceResult){
            case(#err err){
              #err(err);
            };
            case(#ok b){
              let balance = b.balance;
              // If balance is less than invoice amount, return error
              if(balance < i.amount){
                let updatedInvoice = {
                  id = i.id;
                  creator = args.caller;
                  details = i.details;
                  amount = i.amount;
                  // Update invoice with latest balance
                  amountPaid = balance;
                  token = i.token;
                  verifiedAtTime = i.verifiedAtTime;
                  paid = false;
                  refunded = false;
                  expiration = i.expiration;
                  destination = i.destination;
                  refundAccount = i.refundAccount;
                };

                return #err({
                  message = ?Text.concat("Insufficient balance. Current Balance is ", Nat.toText(balance));
                  kind = #NotYetPaid;
                });
              };

              let verifiedAtTime: ?Time.Time = ?Time.now();
              // Otherwise, update with latest balance and mark as paid
              let verifiedInvoice = {
                id = i.id;
                creator = i.creator;
                details = i.details;
                amount = i.amount;
                // update amountPaid
                amountPaid = balance;
                token = i.token;
                // update verifiedAtTime
                verifiedAtTime;
                refundedAtTime = i.refundedAtTime;
                // update paid
                paid = true;
                refunded = false;
                expiration = i.expiration;
                destination = i.destination;
                refundAccount = i.refundAccount;
              };

              // TODO Transfer funds to default subaccount of invoice creator
              let subaccount: SubAccount = U.generateInvoiceSubaccount({ caller = i.creator; id = i.id });

              let transferResult = await transfer({
                memo = 0;
                fee = {
                  e8s = 10000;
                };
                amount = {
                  // Total amount, minus the fee
                  e8s = Nat64.sub(Nat64.fromNat(balance), 10000);
                };
                from_subaccount = ?subaccount;
                to = U.getDefaultAccount({
                  canisterId = args.canisterId;
                  principal = i.creator;
                });
                created_at_time = null;
              });
              switch (transferResult) {
                case (#ok result) {
                  return #ok(#Paid {
                    invoice = verifiedInvoice;
                  });
                };
                case (#err err) {
                  switch (err.kind) {
                    case (#BadFee f) {
                      return #err({
                        message = ?"Bad fee";
                        kind = #TransferError;
                      });
                    };
                    case (#InsufficientFunds f) {
                      return #err({
                        message = ?"Insufficient funds";
                        kind = #TransferError;
                      });
                    };
                    case (_) {
                      return #err({
                        message = ?"Could not transfer funds to invoice creator.";
                        kind = #TransferError;
                      });
                    }
                  };
                };
              };
            };
          };
        }
      };
    };
}
