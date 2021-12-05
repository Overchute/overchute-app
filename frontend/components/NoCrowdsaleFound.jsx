import React from "react"
import { Box, Typography } from "@mui/material"

function NoCrowdsaleFound() {
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "1rem 0" }}>
        Crowdsale
      </Typography>
      <Typography variant="h6" style={{ margin: "2rem 0" }}>
        {`Crowdsale Id : ${crowdsaleId}`}
      </Typography>
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        🤔
      </Typography>
      <Typography
        align="center"
        variant="subtitle1"
        style={{ margin: "2rem 0" }}
      >
        Looks like we couldn't find the crowdsale you were looking for.
        <br />
        Please review the crowdsale you entered and try again.
      </Typography>
    </Box>
  )
}

export default NoCrowdsaleFound
