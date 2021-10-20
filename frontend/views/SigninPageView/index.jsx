import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { Box, Typography } from "@mui/material"
import { useAuthClient } from "../../hooks/useAuthClient"

function SigninPageView() {
  const { isLoggedIn } = useAuthClient()
  const navigate = useNavigate()
  const redirectIfNotAuth = async () => {
    if (isLoggedIn) {
      // Redirect home
      setTimeout(() => {
        navigate(`/`)
      }, 1000)
    }
  }
  useEffect(() => {
    redirectIfNotAuth()
    return () => {}
  }, [isLoggedIn])
  return (
    <Box
      margin="3rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "1rem 0" }}>
        Uh Oh...
      </Typography>
      <Typography variant="h6" style={{ margin: "2rem 0" }}>
        Looks like you need to sign in
      </Typography>
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        😁
      </Typography>
      <Typography
        align="center"
        variant="subtitle1"
        style={{ margin: "2rem 0" }}
      >
        Click the sign in button on the toolbar and proceed
        <br />
        to sign in with your Internet Identity.
      </Typography>
    </Box>
  )
}

export default SigninPageView
