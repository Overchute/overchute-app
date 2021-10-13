import { createActor, canisterId } from "canisters/crowdsale"
import useAuth from "../hooks/useAuth"

const { identity } = useAuth()

const crowdsale = createActor(canisterId, {
  agentOptions: {
    identity: identity,
  },
})

console.log("from crowdsale", identity)

export { crowdsale }
