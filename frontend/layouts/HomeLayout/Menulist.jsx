import React from "react"
import { Link } from "react-router-dom"
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material"
import HomeRounded from "@mui/icons-material/HomeRounded"
import LightIcon from "@mui/icons-material/Brightness7Rounded"
import DarkIcon from "@mui/icons-material/Brightness4Rounded"

import ListIcon from "@mui/icons-material/ListAltRounded"
import AddBoxIcon from "@mui/icons-material/AddBoxRounded"
import SearchIcon from "@mui/icons-material/SearchRounded"

import useSite from "../../hooks/useSite"
import { Auth } from "../../components/Auth"

const Items = [
  {
    page: "home",
    title: "Home",
    url: "/",
    icon: <HomeRounded />,
  },
  {
    page: "create",
    title: "Create",
    url: "/crowdsale/create",
    icon: <AddBoxIcon />,
  },
  {
    page: "search",
    title: "Search",
    url: "/search",
    icon: <SearchIcon />,
  },
  {
    page: "list",
    title: "List",
    url: "/list",
    icon: <ListIcon />,
  },
]

function Menulist(handleClick) {
  const { themeMode, onChangeMode, toolbarMode, onToolbarMode } = useSite()
  const toggleParent = () => {
    console.log("yayayaya")
    handleClick()
  }
  const toggleTheme = () => {
    let t = themeMode === "light" ? "dark" : "light"
    onChangeMode(t)
  }
  return (
    <>
      <List>
        {Items.map((i) => (
          <ListItem
            button
            onClick={toggleParent}
            component={Link}
            to={i.url}
            key={i.page}
          >
            <ListItemIcon sx={{ pl: { xs: 0, sm: 1 } }}>{i.icon}</ListItemIcon>
            <ListItemText primary={i.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem
          button
          onClick={() => {
            toggleTheme()
            toggleParent()
          }}
        >
          <ListItemIcon sx={{ pl: { xs: 0, sm: 1 } }}>
            {themeMode === "light" ? <DarkIcon /> : <LightIcon />}
          </ListItemIcon>
          <ListItemText primary={"Theme"} />
        </ListItem>
      </List>
    </>
  )
}

export default Menulist
