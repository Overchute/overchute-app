import React from "react"
import { Box, Typography } from "@mui/material"

import SearchCrowdsale from "../../components/SearchCrowdsale"

function SearchPageView() {
  return (
    <Box
      margin="3rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h3" style={{ margin: "2rem 0 1rem 0" }}>
        Crowdsale Protocol
      </Typography>

      <Box minWidth="50%" padding="3rem">
        <SearchCrowdsale />
      </Box>
    </Box>
  )
}

export default SearchPageView
