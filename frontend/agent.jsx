import { createActor, canisterId } from "canisters/crowdsale"

const crowdsale = createActor(canisterId, {
  agentOptions: { identity: "123dsfasd45634" },
})

export { crowdsale }
