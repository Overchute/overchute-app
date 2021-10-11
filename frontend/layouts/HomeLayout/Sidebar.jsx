import React from "react"
import LogoName from "../../assets/LogoName"
import { Drawer, AppBar, Toolbar, Box, Divider } from "@mui/material"
import { Auth } from "../../components/Auth"
import Menulist from "./Menulist"

export default function Sidebar() {
  return (
    <Box width="320px">
      <AppBar
        position="fixed"
        sx={{
          width: "calc(100% - 320px)",
          boxShadow: "none",
          padding: "1rem",
          background: "transparent",
          border: "none",
          // background:
          //   "linear-gradient(45deg, #16697A 25%, #fdd508 60% , #DB6400 90%)",
          color: "secondary",
        }}
      >
        <Toolbar>
          <Box padding="0 1rem" marginLeft="auto">
            <Auth />
          </Box>
        </Toolbar>
      </AppBar>
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
