import React from "react"
import { alpha } from "@mui/material/styles"
import LogoName from "../../assets/LogoName"
import { AppBar, Box, Toolbar } from "@mui/material"
import Drawer from "./Drawer"
import { Auth } from "../../components/Auth"

function MobileAppBar() {
  return (
    <Box>
      <AppBar
        sx={{
          boxShadow: 0,
          padding: (theme) => theme.spacing(1),
          backgroundImage: "none",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.72),
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
