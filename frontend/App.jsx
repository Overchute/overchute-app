import React from "react"
import ThemeConfig from "./theme"
import { BrowserRouter } from "react-router-dom"
import Router from "./routes"
import ScrollToTop from "./components/utils/ScrollToTop"

function App() {
  return (
    <ThemeConfig>
      <BrowserRouter>
        <ScrollToTop />
        <Router />
      </BrowserRouter>
    </ThemeConfig>
  )
}

export default App
