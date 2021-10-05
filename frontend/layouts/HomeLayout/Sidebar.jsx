import React, { useContext } from "react"
import { SiteContext } from "../../context/SiteContext"
import { Link } from "react-router-dom"
import { useTheme } from "@mui/material/styles"
import { styled } from "@mui/material/styles"
import MuiDrawer from "@mui/material/Drawer"
import MuiAppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import List from "@mui/material/List"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
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

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "linear-gradient(45deg, #16697A 25%, #fdd508 60% , #DB6400 90%)",
  color: "#fff",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

export default function MiniDrawer() {
  const { themeMode, onChangeMode, toolbarOpen } = useSite()
  const { state, dispatch } = useContext(SiteContext)
  const theme = useTheme()
  var localTheme = localStorage.getItem("theme")

  const handleDrawerOpen = () => {
    dispatch({ type: "TOGGLE_TOOLBAR", payload: true })
  }

  const handleDrawerClose = () => {
    dispatch({ type: "TOGGLE_TOOLBAR", payload: false })
  }

  const toggleTheme = () => {
    console.log("sidebar", localTheme)
    localStorage.setItem("theme", localTheme === "dark" ? "light" : "dark")
    dispatch({
      type: "UPDATE_THEME",
      payload: localTheme === "light" ? "dark" : "light",
    })
  }
  console.log("sidebar", x)
  return (
    <>
      <AppBar position="fixed" open={toolbarOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: "36px",
              ...(toolbarOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Crowdsale Protocol
          </Typography>
          <Box padding="0 1rem" marginLeft="auto">
            <Auth />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={toolbarOpen}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {Items.map((i) => (
            <ListItem button component={Link} to={i.url} key={i.page}>
              <ListItemIcon sx={{ pl: { xs: 0, sm: 1 } }}>
                {i.icon}
              </ListItemIcon>
              <ListItemText primary={i.title} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={toggleTheme}>
            <ListItemIcon sx={{ pl: { xs: 0, sm: 1 } }}>
              {state.theme === "light" ? <DarkIcon /> : <LightIcon />}
            </ListItemIcon>
            <ListItemText primary={"Theme"} />
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}
