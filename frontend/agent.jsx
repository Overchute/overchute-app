import { useEffect } from "react"

import { createActor, canisterId } from "canisters/crowdsale"
import useAuth from "./hooks/useAuth"

const crowdsaleLocal = createActor(canisterId, {
  agentOptions: {},
})

export { crowdsaleLocal }
