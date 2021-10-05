import React from "react"

const AuthContext = React.createContext({
  isAuthenticated: false,
  signedIn: false,
  principal: "",
  identity: "",
  client: null,
})

export default AuthContext
