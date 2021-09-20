import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"

import SearchCrowdsale from "../../components/SearchCrowdsale"

function SearchPageView() {
  return (
    <Box
      margin="6rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        Search a Crowdsale
      </Typography>

      <Box minWidth="50%" padding="3rem">
        <SearchCrowdsale />
      </Box>
    </Box>
  )
}

export default SearchPageView
