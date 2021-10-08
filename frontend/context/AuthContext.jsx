import React, {
  useReducer,
  useContext,
  createContext,
  useEffect,
  useState,
  useRef,
} from "react"
import { AuthClient } from "@dfinity/auth-client"

import AuthReducer from "../reducer/AuthReducer"

const initialState = {
  isAuthenticated: false,
  signedIn: false,
  principal: "",
  identity: "",
  client: null,
}

const AuthContext = createContext({
  ...initialState,
  singIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

function AuthProvider({ children }) {
  // const initialState = useContext(AuthContext)
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  const [client, setClient] = useState()
  const mountedRef = useRef(true)

  useEffect(() => {
    const initAuth = async () => {
      console.log("auth is init")
      const client = await AuthClient.create()
      const isAuthenticated = await client.isAuthenticated()

      dispatch({ type: "SET_CLIENT", payload: client })
      setClient(client)
      console.log("auth client", client)
      if (isAuthenticated) {
        console.log("auth is authenticated")
        const identity = client.getIdentity()
        const principal = identity.getPrincipal().toString()
        dispatch({ type: "SET_AUTHENTICATION", payload: true })
        dispatch({ type: "SET_SIGNED", payload: true })
        dispatch({ type: "SET_PRINCIPAL", payload: principal })
        dispatch({ type: "SET_IDENTITY", payload: identity })
        dispatch({ type: "SET_CLIENT", payload: client })
      }
    }
    initAuth()
    return () => {
      mountedRef.current = false
    }
  }, [])

  const signIn = async () => {
    const { identity, principal } = await new Promise((resolve, reject) => {
      client.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = client.getIdentity()
          const principal = identity.getPrincipal().toString()
          dispatch({ type: "SET_AUTHENTICATION", payload: true })
          dispatch({ type: "SET_SIGNED", payload: true })
          dispatch({ type: "SET_PRINCIPAL", payload: principal })
          dispatch({ type: "SET_IDENTITY", payload: identity })
          dispatch({ type: "SET_CLIENT", payload: client })
          resolve({ identity, principal })
        },
        onError: reject,
      })
    })
  }

  const signOut = async () => {
    await client.logout()

    dispatch({ type: "SET_AUTHENTICATION", payload: false })
    dispatch({ type: "SET_SIGNED", payload: false })
    dispatch({ type: "SET_PRINCIPAL", payload: "" })
    dispatch({ type: "SET_IDENTITY", payload: "" })
    // dispatch({ type: "SET_CLIENT", payload: null })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
