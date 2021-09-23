import React from "react"

const SiteContext = React.createContext({
  theme: "light",
  toolbarOpen: false,
  isAuthenticated: false,
  signedIn: false,
  principal: "",
  identity: "",
  client: null,
})

export default SiteContext
