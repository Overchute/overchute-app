// import React from "react"

// const SiteContext = React.createContext({
//   theme: "light",
//   toolbarOpen: false,
// })

// export default SiteContext

import React, { createContext } from "react"

import useLocalStorage from "../hooks/useLocalStorage"

const initialState = {
  themeMode: "light",
  toolbarOpen: false,
  onChangeMode: () => {},
}

const SiteContext = createContext(initialState)

function SiteProvider({ children }) {
  const [site, setSite] = useLocalStorage("site", {
    themeMode: initialState.themeMode,
  })

  const onChangeMode = (e) => {
    setSite({
      ...site,
      themeMode: e.target.value,
    })
  }

  return (
    <SiteContext.Provider
      value={{
        ...site,
        onChangeMode,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}

export { SiteProvider, SiteContext }
