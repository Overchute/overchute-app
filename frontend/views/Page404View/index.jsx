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
      <img
        src={logo}
        style={{ height: "20vmin", display: "block", margin: "2rem 0 2rem 0" }}
        alt="logo"
      />
      <Typography variant="h1" gutterBottom>
        404
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go Home
      </Button>
    </Box>
  )
}

export default Page404View
