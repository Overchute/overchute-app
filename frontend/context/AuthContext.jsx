import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
} from "react"
import AuthReducer from "../reducer/AuthReducer"
import { AuthClient } from "@dfinity/auth-client"
// import { actorController } from "../agent"
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
  const [isAuth, setIsAuth] = useState(false)
  const mountedRef = useRef(true)
  const login = () => {
    localClient.login({
      identityProvider: "https://identity.ic0.app",
      // identityProvider: "http://localhost:8080",
      onSuccess: () => {
        const identity = localClient.getIdentity()
        const principalId = identity.getPrincipal().toString()
        initActor(identity)
        // actorController.authenticateActor(identity)
        dispatch({ type: "SET_AUTHENTICATION", payload: true })
        dispatch({ type: "SET_IDENTITY", payload: identity })
        dispatch({ type: "SET_PRINCIPAL", payload: principalId })
        dispatch({ type: "SET_IS_LOGGED_IN", payload: true })
        // setIsAuth(true)
        // setPrincipal(principalId)
        // setIsLoggedIn(true)
      },
    })
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
    // setIsAuthenticated(false)
    // setActor(undefined)
    // setPrincipal(undefined)
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
      console.log("auth client", client, identity, principal)
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
