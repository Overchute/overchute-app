import React from "react"
import { Box } from "@mui/material"
import { Outlet } from "react-router-dom"
import { makeStyles } from "@mui/styles"
import SideBar from "./Sidebar"
import Navbar from "./Navbar"
import { Hidden } from "@mui/material"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}))
function HomeLayout() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Hidden lgDown>
        <SideBar />
      </Hidden>
      <Hidden lgUp>
        <Navbar />
      </Hidden>
      <Box
        sx={{
          flexGrow: "1",
          padding: (theme) => theme.spacing(3),
          width: "calc(100% - 320px)",
        }}
      >
        <div className={classes.toolbar} />
        <div>
          <Outlet />
        </div>
      </Box>
    </div>
  )
}

export default HomeLayout
