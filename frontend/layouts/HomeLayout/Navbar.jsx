import React from "react"
import { alpha, styled } from "@mui/material/styles"
import LogoName from "../../assets/LogoName"
import { AppBar, Box, Toolbar } from "@mui/material"
import Drawer from "./Drawer"
import { Auth } from "../../components/Auth"
const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.05),
}))

function MobileAppBar() {
  return (
    <Box>
      <RootStyle>
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
      </RootStyle>
    </Box>
  )
}

export default MobileAppBar
