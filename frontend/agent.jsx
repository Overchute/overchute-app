import React, { useEffect } from "react"

import { createActor, canisterId } from "canisters/crowdsale"

// export const crowdsaleLocal = createActor(canisterId, {
//   agentOptions: {},
// })

class ActorController {
  _actor = null

  constructor() {
    this._actor = this.initBaseActor()
  }

  async initBaseActor(id) {
    let a = {}
    console.log("the id", id, a)
    if (id !== undefined || id !== null) {
      a = { identity: id }
    }
    const actor = createActor(canisterId, {
      agentOptions: a,
    })
    // The root key only has to be fetched for local development environments
    // if (isLocalEnv) {
    //   await agent.fetchRootKey()
    // }
    return actor
  }

  /*
   * Get the actor instance to run commands on the canister.
   */
  get actor() {
    return this._actor
  }

  /*
   * Once a user has authenticated and has an identity pass this identity
   * to create a new actor with it, so they pass their Principal to the backend.
   */
  async authenticateActor(id) {
    this._actor = this.initBaseActor(id)
    // this._isAuthenticated = true;
  }

  /*
   * If a user unauthenticates, recreate the actor without an identity.
   */
  // unauthenticateActor() {
  //   this._actor = this.initBaseActor();
  //   this._isAuthenticated = false;
  // }
}

export const actorController = new ActorController()
