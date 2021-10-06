import React, { useReducer, useContext, createContext } from "react"

import AuthReducer from "../reducer/AuthReducer"

const AuthContext = createContext({
  isAuthenticated: false,
  signedIn: false,
  principal: "",
  identity: "",
  client: null,
})

function AuthProvider({ children }) {
  const initialState = useContext(AuthContext)
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthProvider, AuthContext }
