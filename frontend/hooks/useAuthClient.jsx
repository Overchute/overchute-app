import React, { useState, useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client"
import { createActor, canisterId } from "canisters/crowdsale"

export function useAuthClient() {
  const [authClient, setAuthClient] = useState(new AuthClient())
  const [actor, setActor] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => {
    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const identity = authClient.getIdentity()
        const principalId = identity.getPrincipal().toString()
        initActor(identity)
        setIsAuthenticated(true)
        setPrincipal(principalId)
        setIsLoggedIn(true)
      },
    })
  }

  const initActor = (id) => {
    console.log("init actor", id)
    const actor = createActor(canisterId, {
      agentOptions: {
        identity: id,
      },
    })
    setActor(actor)
  }

  const logout = () => {
    // clear() // this could be used for local storage
    setIsAuthenticated(false)
    setActor(undefined)
    setPrincipal(undefined)
  }

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated()
      setAuthClient(client)
      setIsAuthenticated(true)
    })
  }, [])
  useEffect(() => {
    if (isAuthenticated) {
      initActor()
    }
  }, [isAuthenticated])
  console.log("use Auth", actor)
  return {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    isLoggedIn,
    login,
    logout,
    actor,
    principal,
  }
}
