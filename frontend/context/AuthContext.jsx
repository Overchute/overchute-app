import React, { createContext, useEffect } from "react"
import { useAuthClient } from "../hooks/useAuthClient"

const AuthContext = createContext({
  authClient: undefined,
  setAuthClient: false,
  isAuthenticated: false,
  setIsAuthenticated: false,
  isLoggedIn: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  actor: undefined,
  principal: undefined,
})

function AuthProvider({ children }) {
  const {
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    isLoggedIn,
    login,
    logout,
    actor,
    principal,
  } = useAuthClient()
  //   const identity = authClient.getIdentity()
  //   const principal = identity.getPrincipal().toString()
  useEffect(() => {
    if (actor) {
      console.log("we have actor", actor)
    } else {
      console.log("we dont have actor")
    }
  }, [actor])
  if (!authClient) return null
  return (
    <AuthContext.Provider
      value={{
        authClient,
        setAuthClient,
        isAuthenticated,
        setIsAuthenticated,
        isLoggedIn,
        login,
        logout,
        actor,
        principal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
