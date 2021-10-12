import { createActor, canisterId } from "canisters/crowdsale"

const crowdsale = createActor(canisterId, {
  agentOptions: { identity: identity },
})

export { crowdsale }
