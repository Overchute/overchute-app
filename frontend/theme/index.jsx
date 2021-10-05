import React, { useMemo } from "react"
import { CssBaseline } from "@mui/material"
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles"
import palette from "./palette"
import useSite from "../hooks/useSite"

export default function ThemeConfig({ children }) {
  const { themeMode } = useSite()
  const isLight = themeMode === "light"

  const themeOptions = useMemo(
    () => ({
      palette: isLight
        ? { ...palette.light, mode: "light" }
        : { ...palette.dark, mode: "dark" },
    }),
    [isLight],
  )

  const theme = createTheme(themeOptions)

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
