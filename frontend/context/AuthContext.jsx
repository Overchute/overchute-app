import React, { createContext, useReducer, useEffect, useState } from "react"
import AuthReducer from "../reducer/AuthReducer"
import { AuthClient } from "@dfinity/auth-client"

import { createActor, canisterId, idlFactory } from "canisters/crowdsale"

const initialState = {
  isLoggedIn: false,
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
  // const nnsCanisterId = "deyev-eiaaa-aaaak-aaaca-cai"
  const whitelist = [canisterId]

  const login = async () => {
    // Host
    // const host = "https://mainnet.dfinity.network"
    // const host = "http://localhost:8000/?canisterId=ryjl3-tyaaa-aaaaa-aaaba-cai"

    // Make the request
    const isConnected = await window.ic.plug.requestConnect({
      whitelist,
      // host,
    })
    if (isConnected) {
      console.log("is connected")
      // console.log("agent", window.ic.plug?.agent)
      // const agent = window.ic.plug?.agent
      // const identity = await window.ic.plug?.agent._identity
      console.log(
        "plug object",
        window.ic.plug,
        window.ic.plug?.principal.toString(),
      )
      initActor("plug")
      dispatch({ type: "SET_IS_LOGGED_IN", payload: true })
      dispatch({
        type: "SET_PRINCIPAL",
        payload: window.ic.plug?.principal.toString(),
      })
    } else {
      console.log("plug could not connect")
    }

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

  const initActor = async (id) => {
    // console.log("init actor", id)
    let actor
    if (id === "plug") {
      actor = await window.ic.plug?.createActor({
        canisterId: canisterId,
        interfaceFactory: idlFactory,
      })
    } else {
      actor = createActor(canisterId, {
        agentOptions: {
          identity: id,
        },
      })
    }

    dispatch({ type: "SET_ACTOR", payload: actor })
    console.log("actor", actor)
    // setActor(actor)
  }

  const logout = async () => {
    // clear() // this could be used for local storage
    await localClient.logout()

    dispatch({ type: "SET_IS_LOGGED_IN", payload: false })
    dispatch({ type: "SET_PRINCIPAL", payload: "" })
  }

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      const isAuthenticated = await client.isAuthenticated()

      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()

      dispatch({ type: "SET_IDENTITY", payload: identity })
      dispatch({ type: "SET_PRINCIPAL", payload: principal })
      initActor(identity)
      setLocalClient(client)
    })
  }, [])

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
