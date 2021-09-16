import React from "react"
import { useHistory } from "react-router-dom"
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from "@material-ui/icons/SearchRounded"

import { alpha, makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  search: {
    position: "relative",
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
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(3, 3, 3, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "60ch",
    },
  },
}))

function SearchCrowdsale() {
  const classes = useStyles()
  let history = useHistory()
  const [query, setQuery] = React.useState("")

  const reDirectToShowCrowdsale = (e) => {
    e.preventDefault()
    history.push(`/crowdsale/show/${query}`)
  }
  return (
    <form
      onSubmit={(e) => reDirectToShowCrowdsale(e)}
      noValidate
      autoComplete="off"
    >
      <div>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
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
