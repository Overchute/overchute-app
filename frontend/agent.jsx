import { useEffect } from "react"
import { createActor, canisterId } from "canisters/crowdsale"
import useAuth from "./hooks/useAuth"

function getActorIdentity() {
  const { identity, isAuthenticated } = useAuth()

  return "dgdfsgd68007"
}

const crodwsaleLocal = createActor(canisterId, {
  agentOptions: { identity: getActorIdentity() },
})

export { crodwsaleLocal }
