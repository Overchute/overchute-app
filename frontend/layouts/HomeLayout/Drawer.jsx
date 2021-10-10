import React from "react"
import { styled } from "@mui/material/styles"
import { Drawer, Divider, IconButton, Box } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Menulist from "./Menulist"

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "1rem",
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

function MobileDrawer() {
  const [open, setOpen] = React.useState(false)
  const toggleDrawer = () => {
    console.log("clicked")
    setOpen(false)
  }
  return (
    <Box display={"flex"} alignContent="center">
      <IconButton
        size="large"
        edge="start"
        color="primary"
        aria-label="open drawer"
        sx={{ mr: 3 }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon fontSize="inherit" />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box width="260px">
          <DrawerHeader
            style={{
              padding: "36px",
            }}
          ></DrawerHeader>
          <Divider />
          <Menulist handleClick={toggleDrawer} />
        </Box>
      </Drawer>
    </Box>
  )
}

export default MobileDrawer
