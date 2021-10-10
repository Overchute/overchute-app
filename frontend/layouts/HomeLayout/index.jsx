import React from "react"

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
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <div>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default HomeLayout
