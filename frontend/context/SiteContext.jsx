import React, { createContext } from "react"

import useLocalStorage from "../hooks/useLocalStorage"

const initialState = {
  themeMode: "light",
  toolbarMode: false,
  drawerMode: false,
  onChangeMode: () => {},
  onToolbarMode: () => {},
  onDrawerMode: () => {},
}

const SiteContext = createContext(initialState)

function SiteProvider({ children }) {
  const [site, setSite] = useLocalStorage("site", {
    themeMode: initialState.themeMode,
    toolbarMode: initialState.toolbarMode,
    drawerMode: initialState.drawerMode,
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
  const onDrawerMode = (o) => {
    setSite({
      ...site,
      drawerMode: o,
    })
  }
  return (
    <SiteContext.Provider
      value={{
        ...site,
        onChangeMode,
        onToolbarMode,
        onDrawerMode,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export { SiteProvider, SiteContext }
