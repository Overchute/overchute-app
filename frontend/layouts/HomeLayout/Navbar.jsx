import * as React from "react"
import LogoName from "../../assets/LogoName"
import { styled, alpha } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import InputBase from "@mui/material/InputBase"
import MenuIcon from "@mui/icons-material/Menu"
import SearchIcon from "@mui/icons-material/Search"
import Drawer from "./Drawer"
import { Auth } from "../../components/Auth"

export default function MobileAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          padding: "1rem",
          background: "transparent",
        }}
      >
        <Toolbar>
          <Drawer />
          <LogoName
            primary="#16697A"
            secondary="gold"
            height="8vmin"
            margin="1rem 0"
          />
          <Box padding="0 1rem" marginLeft="auto">
            <Auth />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
