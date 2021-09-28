import React from "react"
import { Link } from "react-router-dom"
import { Box, Typography, Button } from "@mui/material"
import logo from "../../assets/logo.svg"

function Page404View() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      {/* <img
        src={logo}
        style={{ height: "20vmin", display: "block", margin: "2rem 0 2rem 0" }}
        alt="logo"
      /> */}
      <Typography variant="h1" gutterBottom style={{ fontSize: "16rem" }}>
        404
      </Typography>
      <Typography variant="h2" gutterBottom>
        😲
      </Typography>
      <Typography variant="h5" gutterBottom>
        Sorry, we couldn't find the page you were looking for!!!
      </Typography>

      <Button
        variant="outlined"
        color="primary"
        component={Link}
        to="/"
        style={{ margin: "2rem" }}
      >
        Go Home
      </Button>
    </Box>
  )
}

export default Page404View
