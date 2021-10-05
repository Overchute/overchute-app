import React, { useContext } from "react"

import { Box, Typography, Button } from "@mui/material"
import LogoName from "../../assets/LogoName"
import AddBoxIcon from "@mui/icons-material/AddBoxRounded"
import { Link } from "react-router-dom"

function HomePageView() {
  return (
    <Box
      margin="3rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box style={{ display: "block", margin: "2rem 0" }} alt="logo">
        <LogoName primary="#16697A" secondary="gold" />
      </Box>
      <Box maxWidth="50%" style={{ textAlign: "center" }}>
        <Typography variant="h5" gutterBottom style={{ margin: "2rem 0" }}>
          A decentralized smart-contract application for crowdfunding the
          release of intellectual property under open licences.
        </Typography>
      </Box>

      <Box margin="4rem 0">
        <Button
          component={Link}
          to="/crowdsale/create"
          variant="outlined"
          color="primary"
          size="large"
          startIcon={<AddBoxIcon />}
          style={{ padding: "1rem" }}
        >
          <Typography variant="h5">Create a crowdsale</Typography>
        </Button>
      </Box>
    </Box>
  )
}

export default HomePageView
