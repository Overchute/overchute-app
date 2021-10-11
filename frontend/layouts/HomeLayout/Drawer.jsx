import React from "react"
import { Drawer, Divider, IconButton, Box } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Menulist from "./Menulist"
import useSite from "../../hooks/useSite"

function MobileDrawer() {
  const { drawerMode, onDrawerMode } = useSite()
  const onClickOpen = () => {
    onDrawerMode(true)
  }
  const onClickClose = () => {
    console.log("clicked")
    onDrawerMode(false)
  }
  // console.log("drawer", drawerMode, onDrawerMode)
  return (
    <Box display={"flex"} alignContent="center">
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="open drawer"
        sx={{ mr: 3 }}
        onClick={onClickOpen}
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer anchor="left" open={drawerMode} onClose={onClickClose}>
        <Box width="260px">
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "36px",
            }}
          ></Box>
          <Divider />
          <Menulist />
        </Box>
      </Drawer>
    </Box>
  )
}

export default MobileDrawer
