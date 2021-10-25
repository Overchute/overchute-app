import React, { useContext } from "react"

import { Box, Typography, Button } from "@mui/material"
import LogoName from "../../assets/LogoName"

import AddBoxIcon from "@mui/icons-material/AddBoxRounded"
import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
// import { crowdsale } from "canisters/crowdsale"
import imgScene from "../../assets/creators_contributors_scene.svg"

function HomePageView() {
  const { actor } = useAuth()
  console.log("home", "actor :", actor)
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        style={{
          display: "block",
          margin: "3rem 0",
        }}
        width={{ xs: "95%", sm: "85%", md: "65%", lg: "65%", xl: "65%" }}
        alt="scene"
      >
        <img src={imgScene} width="100%" />
      </Box>
      <Box
        maxWidth={{ xs: "95%", sm: "85%", md: "65%", lg: "55%", xl: "55%" }}
        style={{ textAlign: "center" }}
      >
        <Typography variant="h5" gutterBottom style={{ margin: "2rem 0" }}>
          A decentralized smart-contract application for crowdfunding the
          release of intellectual property under open licences.
        </Typography>
      </Box>

      <Box margin="2rem 0">
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
      <Box height="500px"></Box>
    </Box>
  )
}

export default HomePageView
