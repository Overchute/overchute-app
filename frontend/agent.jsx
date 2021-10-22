import React, { useEffect } from "react"
import { createActor, canisterId } from "canisters/crowdsale"
import { ident } from "./yeah"

// const getId = () => {
//   const { identity } = useAuth()

//   return
// }
const crowdsaleLocal = createActor(canisterId, {
  agentOptions: { identity: ident },
})

export { crowdsaleLocal }
