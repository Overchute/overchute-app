import { createActor, canisterId } from "canisters/crowdsale"
import useAuth from "../hooks/useAuth"

const crowdsale = () => {
  const { identity } = useAuth()
  console.log("from crowdsale", identity)
  return createActor(canisterId, {
    agentOptions: {
      identity: identity,
    },
  })
}

export { crowdsale }
