import React, { createContext } from "react"

import useLocalStorage from "../hooks/useLocalStorage"

const initialState = {
  themeMode: "light",
  toolbarMode: false,
  onChangeMode: () => {},
  onToolbarMode: () => {},
}

const SiteContext = createContext(initialState)

function SiteProvider({ children }) {
  const [site, setSite] = useLocalStorage("site", {
    themeMode: initialState.themeMode,
    toolbarMode: initialState.toolbarMode,
  })

  const onChangeMode = (v) => {
    setSite({
      ...site,
      themeMode: v,
    })
  }
  const onToolbarMode = (t) => {
    setSite({
      ...site,
      toolbarMode: t,
    })
  }
  return (
    <SiteContext.Provider
      value={{
        ...site,
        onChangeMode,
        onToolbarMode,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export { SiteProvider, SiteContext }
