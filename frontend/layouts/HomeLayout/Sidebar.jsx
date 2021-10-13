import React from "react"
import { alpha, styled } from "@mui/material/styles"
import LogoName from "../../assets/LogoName"
import { Drawer, AppBar, Toolbar, Box, Divider } from "@mui/material"
import { Auth } from "../../components/Auth"
import Menulist from "./Menulist"
const RootStyle = styled(AppBar)(({ theme }) => ({
  width: "calc(100% - 320px)",
  padding: "1rem",
  boxShadow: "none",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.05),
}))
export default function Sidebar() {
  return (
    <Box width="320px">
      <RootStyle>
        <Toolbar>
          <Box padding="0 1rem" marginLeft="auto">
            <Auth />
          </Box>
        </Toolbar>
      </RootStyle>
      <Drawer variant="permanent" open={true}>
        <Box width="320px">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoName
              primary="#16697A"
              secondary="gold"
              height="7vmin"
              margin="2rem 0"
            />
          </Box>
          <Divider />
          <Menulist />
        </Box>
      </Drawer>
    </Box>
  )
}
