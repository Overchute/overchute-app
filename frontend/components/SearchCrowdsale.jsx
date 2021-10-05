import React from "react"

import { useNavigate } from "react-router-dom"
import InputBase from "@mui/material/InputBase"
import SearchIcon from "@mui/icons-material/SearchRounded"

import { alpha } from "@mui/material/styles"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
    padding: theme.spacing(2, 2, 2, 0),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.search.bg, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.search.bg, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 1),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    paddingLeft: "2rem",
  },
  inputInput: {
    padding: theme.spacing(3, 3, 3, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    // [theme.breakpoints.up("md")]: {
    //   width: "60ch",
    // },
  },
}))

function SearchCrowdsale() {
  const classes = useStyles()
  console.log("classes", classes)
  const navigate = useNavigate()
  const [query, setQuery] = React.useState("")

  const reDirectToShowCrowdsale = (e) => {
    e.preventDefault()
    navigate(`/show/${query}`)
  }
  return (
    <form
      onSubmit={(e) => reDirectToShowCrowdsale(e)}
      noValidate
      autoComplete="off"
    >
      <div>
        <div className={classes.search}>
          {/* <div className={classes.searchIcon}>
            <SearchIcon />
          </div> */}
          <InputBase
            placeholder="Search…"
            fullWidth
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </form>
  )
}

export default SearchCrowdsale
