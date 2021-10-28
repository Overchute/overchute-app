import React, { useContext } from "react"
import { blueGrey } from "@mui/material/colors"
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  Grid,
  Divider,
} from "@mui/material"

import AddBoxIcon from "@mui/icons-material/AddBoxRounded"
import { Link } from "react-router-dom"
import SearchCrowdsale from "../SearchPageView"
import useAuth from "../../hooks/useAuth"
// import { crowdsale } from "canisters/crowdsale"
import imgScene from "../../assets/creators_contributors_scene.svg"
import creatorsScene from "../../assets/creator_scene.svg"
import communitiesScene from "../../assets/communities_scene.svg"

function HomePageView() {
  // const { actor, principal } = useAuth()
  // console.log("home", "actor :", actor, "principal :", principal)
  return (
    <Container maxWidth="lg">
      <Paper elevation="3">
        <Box
          margin="1rem 0 0 0"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <SearchCrowdsale />
          <Box
            maxWidth={{ xs: "95%", sm: "85%", md: "65%", lg: "55%", xl: "55%" }}
            sx={{ textAlign: "center" }}
            marginBottom="4rem"
          >
            <Typography variant="h5" gutterBottom style={{ margin: "2rem 0" }}>
              A decentralized smart-contract application for crowdfunding the
              release of intellectual property under open licences.
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              padding="2rem"
            >
              <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
                Creators
              </Typography>
              <Typography variant="h6" gutterBottom>
                build for the world to use
              </Typography>
              <img
                src={creatorsScene}
                width="85%"
                style={{ padding: "2rem" }}
              />
              <Divider
                variant="middle"
                sx={{ borderColor: blueGrey[700], marginBottom: "1rem" }}
              />
              <Typography
                variant="h6"
                style={{ marginBottom: "1rem" }}
                textAlign="center"
              >
                Monetize your work without having to enforce restrictive
                licences.
              </Typography>
              <Divider light />
              <Typography
                variant="h6"
                style={{ marginBottom: "1rem" }}
                textAlign="center"
              >
                Get rewarded for producing public goods.
              </Typography>
            </Box>
            <Box textAlign={"center"}></Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Box
              display="flex"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              padding="2rem"
            >
              <Typography variant="h4" sx={{ marginBottom: "1rem" }}>
                Communities
              </Typography>
              <Typography variant="h6" gutterBottom>
                mobilize your collective buying power
              </Typography>
              <img
                src={communitiesScene}
                width="85%"
                style={{ padding: "2rem" }}
              />
              <Divider variant="middle" />
              <Typography
                variant="h6"
                style={{ marginBottom: "1rem" }}
                textAlign="center"
              >
                Club together to release the products you need. You only pay if
                others do too.
              </Typography>
              <Divider light />
              <Typography
                variant="h6"
                style={{ marginBottom: "1rem" }}
                textAlign="center"
              >
                Know what you’re getting up-front.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box height={"2000px"}></Box>
      </Paper>
    </Container>
  )
}

export default HomePageView
