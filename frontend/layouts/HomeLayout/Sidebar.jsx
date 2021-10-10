import React from "react"
import LogoName from "../../assets/LogoName"
import { Link } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import { styled } from "@mui/material/styles"
import Drawer from "@mui/material/Drawer"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"

import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"

import useSite from "../../hooks/useSite"
import { Auth } from "../../components/Auth"
import Menulist from "./Menulist"

const drawerWidth = 320

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

export default function MiniDrawer() {
  const { themeMode, onChangeMode, toolbarMode, onToolbarMode } = useSite()
  const theme = useTheme()

  // const handleDrawerOpen = () => {
  //   onToolbarMode(true)
  // }

  // const handleDrawerClose = () => {
  //   onToolbarMode(false)
  // }

  // const toggleTheme = () => {
  //   let t = themeMode === "light" ? "dark" : "light"
  //   onChangeMode(t)
  // }
  console.log("sidebar")
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
        <Toolbar style={{ color: "#222" }}>
          <Box padding="0 1rem" marginLeft="auto">
            <Auth />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={true}>
        <Box width="320px">
          <DrawerHeader
            style={
              {
                // padding: "36px",
              }
            }
          >
            <LogoName
              primary="#16697A"
              secondary="gold"
              height="7vmin"
              margin="2rem 0"
            />
          </DrawerHeader>
          <Divider />
          <Menulist />
        </Box>
      </Drawer>
    </Box>
  )
}
