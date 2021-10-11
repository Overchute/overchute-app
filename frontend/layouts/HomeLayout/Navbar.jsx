import React from "react"
import LogoName from "../../assets/LogoName"
import { AppBar, Box, Toolbar } from "@mui/material"
import Drawer from "./Drawer"
import { Auth } from "../../components/Auth"

function MobileAppBar() {
  return (
    <Box>
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

export default MobileAppBar
