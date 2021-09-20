import { AppTheme } from "./types"
import { grey, blueGrey } from "@mui/material/colors"

const appThemeOptions = {
  [AppTheme.LIGHT]: {
    palette: {
      mode: "light",
      common: {
        black: "#000",
        white: "#fff",
      },
      primary: {
        main: "#16697A",
        contrast: "#fff",
      },
      secondary: {
        main: "#DB6400",
        contrast: "#fff",
      },
      text: {
        primary: blueGrey[700],
        secondary: blueGrey[400],
        disabled: grey.A200,
        hint: grey.A200,
      },
      background: {
        paper: "#fff",
        default: "#fafafa",
      },
      search: {
        bg: "#aeaeae",
      },
    },
  },
  [AppTheme.DARK]: {
    palette: {
      mode: "dark",
      common: {
        black: "#000",
        white: "#fff",
      },
      primary: {
        main: "#16697A",
        contrast: "#fff",
      },
      secondary: {
        main: "#DB6400",
        contrast: "#fff",
      },
      text: {
        primary: blueGrey[300],
        secondary: blueGrey[100],
        disabled: grey.A200,
        hint: grey.A200,
      },
      background: {
        paper: "#222639",
        default: "#1B1E2E",
      },
      search: {
        bg: "#fff",
      },
    },
  },
}

export default appThemeOptions
