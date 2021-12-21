### Types
```
type Crowdsale = {
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
    imageUrl: ?Text;
    identity: Text;
};

type ProductType = { #SOURCE_CODE; };

type CrowdsaleContribution = {
    crowdsaleId: CrowdsaleId;
    contributor: UserId;
    amount: Float;
    date: Time.Time;
};

type CrowdsaleOvershootShare = {
    crowdsaleId: CrowdsaleId; // crowdsale id
    overshoot: Float; // total overshoot
    platformOvershootShare: Float; // overshoot share to pay to the platform
    creatorOvershootShareTotal: Float; // overshoot share to pay to the creator
    creatorPayoutTotal: Float; // total amount to pay to the creator including overshoot and offer price
    contributorsContributionsAll: Trie.Trie<Principal, Float>; // total amount of all contributionds per contributor
    contributorsPayout: Trie.Trie<Principal, Float>; // overshoot share per contributor
    contributorsPayoutTotal: Float; // the total amount to pay to contributors
};

type Status = { #OPEN; #CLOSED; #FAILED; #SUCCEEDED; };

type CrowdsaleCreate = {
    offerPrice: Float;
    deadline: Time.Time;
    productType: ProductType;
    imageUrl: ?Text;
};

CrowdsaleUpdate = {
    crowdsaleId: CrowdsaleId;
    offerPrice: Float;
    deadline: Time.Time;
};

Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
};
```
___
### Public Methods
#### Crowdsale: 
- ###### Create:
`createCrowdsale(crowdsaleCreate: CrowdsaleCreate) : async Result.Result<(Text), Error>`
- ###### Update:
`update(crowdsaleUpdate: CrowdsaleUpdate) : async Result.Result<(Text), Error>`
- ###### Get by crowdsale id:
`getCrowdsale(id: CrowdsaleId) : async Result.Result<Crowdsale, Error>`
- ###### Delete by crowdsale id:
`delete(id: CrowdsaleId) : async Result.Result<(Text), Error>`
- ###### Get all crowdsales:
`getAllCrowdsales() : async [Crowdsale]`
- ###### Get all crowdsales by status:
`getCrowdsalesByStatus(status: Status) : async [Crowdsale]`
- ###### Get crowdsales by caller:
`getCrowdsalesByCaller() : async [Crowdsale]`
- ###### Get crowdsales by expiration:
`getCrowdsalesByExpiration(isExpired: Bool) : async [Crowdsale]`
- ###### Get crowdsales by principal:
`getCrowdsalesByCreator(creator: Principal) : async [Crowdsale]`
- ###### Check and update crowdsale status:
`func checkAndUpdateStatus(id: CrowdsaleId)`
___
##### Contribution:
- ###### Make contribution by crowdsale id:
`makeContribution(crowdsaleId: CrowdsaleId, amount: Float) : async Result.Result<(Text), Error>`
- ###### Get all contributions by crowdsale id:
`getAllContributionsByCrowdsaleId(id: CrowdsaleId) : async Result.Result<([CrowdsaleContribution]), Error>`
- ###### Get contribution by caller and crowdsale id:
`getContributionByCallerAndCrowdsaleId(id: CrowdsaleId) : async Result.Result<([CrowdsaleContribution]), Error>`
- ###### Get contribution by principal and crowdsale id:
`getContributionByPrincipalAndCrowdsaleId(id: CrowdsaleId, callerId: Principal) : async Result.Result<([CrowdsaleContribution]]), Error>`
___
##### Results:
- ###### Get results by crowdsale id:
`calculateResults(crowdsaleId: CrowdsaleId) : async Result.Result<CrowdsaleOvershootShare, Error>`