import React, { useReducer, useContext, useEffect } from "react"
import SiteContext from "./context"
import siteReducer from "./reducer"
import { BrowserRouter } from "react-router-dom"
import Router from "./routes"

import CssBaseline from "@mui/material/CssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import AppThemeOptions from "./assets/theme/index"
import { AppTheme } from "./assets/theme/types"

function App() {
  const initialState = useContext(SiteContext)
  const [state, dispatch] = useReducer(siteReducer, initialState)
  var localTheme = localStorage.getItem("theme")
  if (localTheme === null) {
    localStorage.setItem("theme", "light")
  }

  const asyncRunner = async () => {
    dispatch({
      type: "UPDATE_THEME",
      payload: localTheme === "light" ? AppTheme.LIGHT : AppTheme.DARK,
    })
  }
  var muiTheme = createTheme(AppThemeOptions[state.theme])
  useEffect(() => {
    asyncRunner()
  }, [])
  console.log(state.theme)

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <SiteContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </SiteContext.Provider>
    </ThemeProvider>
  )
}

export default App
