import React from "react"
import ThemeConfig from "./theme"
import { BrowserRouter } from "react-router-dom"
import Router from "./routes"

function App() {
  return (
    <ThemeConfig>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeConfig>
  )
}

export default App
