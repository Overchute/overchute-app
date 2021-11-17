import React, { createContext, useReducer, useEffect, useState } from "react"
import AuthReducer from "../reducer/AuthReducer"
import { AuthClient } from "@dfinity/auth-client"

import { createActor, canisterId } from "canisters/crowdsale"

const initialState = {
  authClient: undefined,
  setAuthClient: false,
  isAuthenticated: false,
  setIsAuthenticated: false,
  isLoggedIn: false,
  identity: undefined,
  actor: undefined,
  principal: undefined,
}

const AuthContext = createContext({
  ...initialState,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
})

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const [localClient, setLocalClient] = useState(undefined)

  const login = async () => {
    const nnsCanisterId = "ryjl3-tyaaa-aaaaa-aaaba-cai"

    // Whitelist
    const whitelist = [nnsCanisterId]

    // Host
    const host = "https://mainnet.dfinity.network"

    // Make the request
    const result = await window.ic.plug.requestConnect({
      whitelist,
      host,
    })

    const connectionState = result ? "allowed" : "denied"
    console.log(`The Connection was ${connectionState}!`)
    // localClient.login({
    //   identityProvider: "https://identity.ic0.app",
    //   // identityProvider:
    //   //   "http://localhost:8000/?canisterId=rwlgt-iiaaa-aaaaa-aaaaa-cai",
    //   onSuccess: () => {
    //     const identity = localClient.getIdentity()
    //     const principalId = identity.getPrincipal().toString()
    //     initActor(identity)
    //     dispatch({ type: "SET_AUTHENTICATION", payload: true })
    //     dispatch({ type: "SET_IDENTITY", payload: identity })
    //     dispatch({ type: "SET_PRINCIPAL", payload: principalId })
    //     dispatch({ type: "SET_IS_LOGGED_IN", payload: true })
    //   },
    // })
  }

  const initActor = (id) => {
    // console.log("init actor", id)
    const actor = createActor(canisterId, {
      agentOptions: {
        identity: id,
      },
    })
    dispatch({ type: "SET_ACTOR", payload: actor })
    // setActor(actor)
  }

  const logout = async () => {
    // clear() // this could be used for local storage
    await localClient.logout()
    dispatch({ type: "SET_AUTHENTICATION", payload: false })
    dispatch({ type: "SET_IS_LOGGED_IN", payload: false })
    dispatch({ type: "SET_PRINCIPAL", payload: "" })
    dispatch({ type: "SET_IDENTITY", payload: "" })
  }

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated()
      // dispatch({ type: "SET_AUTHENTICATION", payload: true })
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      dispatch({ type: "SET_AUTH_CLIENT", payload: client })
      dispatch({ type: "SET_IDENTITY", payload: identity })
      dispatch({ type: "SET_PRINCIPAL", payload: principal })
      initActor(identity)
      setLocalClient(client)
      // console.log("auth client", client, identity, principal)
      // setAuthClient(client)
      // setIsAuthenticated(true)
    })
  }, [])
  // useEffect(() => {
  //   if (isAuthenticated) initActor()
  // }, [isAuthenticated])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
