import React, { useEffect } from "react"

import { createActor, canisterId } from "canisters/crowdsale"
// import { withHookHOC } from "./hooks/withHookHOC"

// class CrowdsaleLocal extends React.Component {
//   render() {
//     return createActor(canisterId, {
//       agentOptions: { identity: this.props.id },
//     })
//   }
// }

// export default withHookHOC(CrowdsaleLocal)

const crowdsaleLocal = createActor(canisterId, {
  agentOptions: {},
})

export { crowdsaleLocal }

// class ActorController {
//   actor = null

//   constructor() {
//     this._actor = this.initBaseActor()
//   }

//   async initBaseActor(Identity) {
//     return createActor(canisterId, {
//       agentOptions: { identity: Identity },
//     })
//   }
//   get actor() {
//     return this._actor
//   }
// }

// export const actorController = new ActorController()
