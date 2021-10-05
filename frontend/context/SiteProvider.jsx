// import React, { useReducer, useContext, useEffect } from "react"
// import {SiteContext} from "./SiteContext"
// import siteReducer from "../reducer"
// import CssBaseline from "@mui/material/CssBaseline"
// import { createTheme, ThemeProvider } from "@mui/material/styles"
// import AppThemeOptions from "../assets/theme/index"
// import { AppTheme } from "../assets/theme/types"

// function SiteProvider({ children }) {
//   const initialState = useContext(SiteContext)
//   const [state, dispatch] = useReducer(siteReducer, initialState)
//   var localTheme = localStorage.getItem("theme")
//   if (localTheme === null) {
//     localStorage.setItem("theme", "light")
//   }

//   const asyncRunner = async () => {
//     dispatch({
//       type: "UPDATE_THEME",
//       payload: localTheme === "light" ? AppTheme.LIGHT : AppTheme.DARK,
//     })
//   }
//   var muiTheme = createTheme(AppThemeOptions[state.theme])

//   useEffect(() => {
//     asyncRunner()
//     return () => {}
//   }, [])
//   console.log("theme", AppThemeOptions[state.theme])
//   return (
//     <SiteContext.Provider value={{ state, dispatch }}>
//       <ThemeProvider theme={muiTheme}>
//         <CssBaseline />
//         {children}
//       </ThemeProvider>
//     </SiteContext.Provider>
//   )
// }

// export default SiteProvider
