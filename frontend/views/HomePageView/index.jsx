import React from "react"
import { Box, Typography, Paper, Container, Grid, Divider } from "@mui/material"
import SearchCrowdsale from "../SearchPageView"
// import useAuth from "../../hooks/useAuth"
// import { crowdsale } from "canisters/crowdsale"

import creatorsScene from "../../assets/creator_scene.svg"
import communitiesScene from "../../assets/communities_scene.svg"
import whatIsWorthScene from "../../assets/what_is_it_worth.svg"
import handshakeScene from "../../assets/handshake.svg"
import moreMerrierScene from "../../assets/more_merrier.svg"

function HomePageView() {
  // const { actor, principal } = useAuth()
  // console.log("home", "actor :", actor, "principal :", principal)
  return (
    <Container>
      <Grid container spacing={10} marginBottom="6rem">
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box
              margin="3rem 0"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <SearchCrowdsale />
              <Box
                maxWidth={{
                  xs: "95%",
                  sm: "85%",
                  md: "65%",
                  lg: "55%",
                  xl: "55%",
                }}
                sx={{ textAlign: "center" }}
                margin="3rem 0"
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  style={{ margin: "2rem 0" }}
                >
                  A decentralized smart-contract application for crowdfunding
                  the release of intellectual property under open licences.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box padding="4rem 0">
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
                    <Divider sx={{ width: "100%", margin: "1rem 0" }} />
                    <Typography
                      variant="h6"
                      style={{ marginBottom: "1rem" }}
                      textAlign="center"
                    >
                      Monetize your work without having to enforce restrictive
                      licences.
                    </Typography>
                    <Divider sx={{ width: "100%", margin: "1rem 0" }} />
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
                    <Divider sx={{ width: "100%", margin: "1rem 0" }} />
                    <Typography
                      variant="h6"
                      style={{ marginBottom: "1rem" }}
                      textAlign="center"
                    >
                      Club together to release the products you need. You only
                      pay if others do too.
                    </Typography>
                    <Divider sx={{ width: "100%", margin: "1rem 0" }} />
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
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box padding="6rem 0">
              <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBottom: "3rem" }}
              >
                How It Works
              </Typography>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  width="100px"
                  height="100px"
                  backgroundColor="#16697a"
                  color="#fff"
                  fontSize="2rem"
                  fontWeight="700"
                  marginBottom="2rem"
                >
                  1
                </Box>
                <Typography variant="h4" style={{ marginBottom: "2rem" }}>
                  Offer
                </Typography>
                <Typography
                  textAlign="center"
                  variant="subtitle1"
                  style={{ marginBottom: "3rem", maxWidth: "75%" }}
                >
                  A creator releases an already-existing digital product under a
                  standard open-source or creative-commons licence, but with a
                  suspensive condition, so it only comes into force upon the
                  success of a crowdsale, with a specified asking price.
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  width="100px"
                  height="100px"
                  backgroundColor="#16697a"
                  color="#fff"
                  fontSize="2rem"
                  fontWeight="700"
                  marginBottom="2rem"
                >
                  2
                </Box>
                <Typography variant="h4" style={{ marginBottom: "2rem" }}>
                  Contribute
                </Typography>
                <Typography
                  textAlign="center"
                  variant="subtitle1"
                  style={{ marginBottom: "3rem", maxWidth: "75%" }}
                >
                  People and organizations who want the product make
                  contributions to the crowdsale but here's the twist: the
                  accumulating contributions are not revealed. This is the Blind
                  Crowdsale Protocol.
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="50%"
                  width="100px"
                  height="100px"
                  backgroundColor="#16697a"
                  color="#fff"
                  fontSize="2rem"
                  fontWeight="700"
                  marginBottom="2rem"
                >
                  3
                </Box>
                <Typography variant="h4" style={{ marginBottom: "2rem" }}>
                  Distribute
                </Typography>
                <Typography
                  textAlign="center"
                  variant="subtitle1"
                  style={{ marginBottom: "3rem", maxWidth: "75%" }}
                >
                  At the end of the crowdsale period, if the contributed total
                  falls short of the asking price, all contributions are
                  refunded - no deal. But if the contributed total exceeds the
                  asking price, the product is released under the open licence.
                  The asking price is paid to the creator and the excess
                  contributions (overshoot) are shared equally between the
                  creator and contributors, after a platform fee.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3}>
            <Box padding="6rem 3rem">
              <Typography
                variant="h3"
                sx={{ textAlign: "center", marginBottom: "3rem" }}
              >
                Why It Works
              </Typography>
              <Box margin="4rem 0">
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12} md={4}>
                    <Box
                      display="flex"
                      justifyContent={{
                        xs: "center",
                        sm: "center",
                        md: "flex-end",
                      }}
                    >
                      <img width="65%" src={whatIsWorthScene} alt="" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8}>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="h6"
                    >
                      What's it worth to me?
                    </Typography>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="subtitle1"
                    >
                      Projects providing public goods usually suffer from the
                      free-rider problem, where people hold back hoping others
                      will contribute enough. But with the Blind Crowdsale
                      Protocol, you can't see how much others are contributing,
                      so you can't free-ride without risking failure of the
                      crowdsale. If you really want what's on offer, you have to
                      contribute in line with the value it will add in your work
                      and life.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box margin="4rem 0">
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12} md={4}>
                    <Box
                      display="flex"
                      justifyContent={{
                        xs: "center",
                        sm: "center",
                        md: "flex-end",
                      }}
                    >
                      <img width="65%" src={handshakeScene} alt="handshake" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8}>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="h6"
                    >
                      Meet me half-way
                    </Typography>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="subtitle1"
                    >
                      As a creator, setting a low asking price gives the best
                      chance of success, and because the overshoot is shared,
                      you don't miss out on higher contributions.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box margin="4rem 0">
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={12} md={4}>
                    <Box
                      display="flex"
                      justifyContent={{
                        xs: "center",
                        sm: "center",
                        md: "flex-end",
                      }}
                    >
                      <img width="65%" src={moreMerrierScene} alt="" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12} md={8}>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="h6"
                    >
                      The more the merrier
                    </Typography>
                    <Typography
                      textAlign={{ xs: "center", sm: "center", md: "left" }}
                      variant="subtitle1"
                    >
                      Overchute-sharing turns contributors into marketers. As a
                      contributor, you'll want to refer the crowdsale to other
                      potential contributors, to increase the chance of success
                      and the size of the overshoot, which reduces your own net
                      contribution.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default HomePageView
