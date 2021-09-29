### Types
```
Crowdsale = {
    crowdsaleId: CrowdsaleId;
    creator: UserId;
    createdAt: Time.Time;
    updatedAt: Time.Time;
    status: Status;
    offerPrice: Float;
    deadline: Time.Time;
    contributedAmount: Float;
    contributions: Trie.Trie<Principal, Float>;
};

CrowdsaleCreate = {
    offerPrice: Float;
    deadline: Time.Time;
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
- ###### Get crowdsales by caller:
`getCrowdsalesByCaller() : async [Crowdsale]`
- ###### Get crowdsales by principal:
`getCrowdsalesByCreator(creator: Principal) : async [Crowdsale]`
- ###### Check and update crowdsale status:
`func checkAndUpdateStatus(id: CrowdsaleId)`
___
##### Contribution:
- ###### Make contribution by crowdsale id:
`makeContribution(id: CrowdsaleId, amount: Float) : async Result.Result<(Text), Error>`
- ###### Get all contributions by crowdsale id:
`getAllContributionsByCrowdsaleId(id: CrowdsaleId) : async Result.Result<(Trie.Trie<Principal, Float>), Error>`
- ###### Get contribution by caller and crowdsale id:
`getContributionByCallerAndCrowdsaleId(id: CrowdsaleId) : async Result.Result<(Float), Error>`
- ###### Get contribution by principal and crowdsale id:
`getContributionByPrincipalAndCrowdsaleId(id: CrowdsaleId, callerId: Principal) : async Result.Result<(Float), Error>`