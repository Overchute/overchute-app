import React, { useContext } from "react"
import SiteContext from "../../context"
import { Box, Typography, Button } from "@mui/material"
import LogoName from "../../assets/LogoName"
import AddBoxIcon from "@mui/icons-material/AddBoxRounded"
import { Link } from "react-router-dom"

function HomePageView() {
  const { state } = useContext(SiteContext)

  console.log("state", state)
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
          Create new crowdsale
        </Button>
        {/* <Typography variant="button">
          <Link
            href="https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html"
            target="_blank"
            rel="noopener"
            style={{ padding: "0 1rem" }}
          >
            ic sdk docs
          </Link>
          <Link
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener"
            style={{ padding: "0 1rem" }}
          >
            vite docs
          </Link>
          <Link
            href="https://reactjs.org"
            target="_blank"
            rel="noopener"
            style={{ padding: "0 1rem" }}
          >
            learn react
          </Link>
          <Link
            href="https://material-ui.com/"
            target="_blank"
            rel="noopener"
            style={{ padding: "0 1rem" }}
          >
            material ui
          </Link>
        </Typography> */}
      </Box>
    </Box>
  )
}

export default HomePageView
