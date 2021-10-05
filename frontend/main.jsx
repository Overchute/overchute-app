import React from "react"
import ReactDOM from "react-dom"
import { SiteProvider } from "./context/SiteContext"
import AuthProvider from "./context/AuthProvider"
import App from "./App"

ReactDOM.render(
  <React.StrictMode>
    <SiteProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </SiteProvider>
  </React.StrictMode>,
  document.getElementById("root"),
)
