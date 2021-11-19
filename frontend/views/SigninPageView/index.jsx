import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import useAuth from "../../hooks/useAuth"

function SigninPageView() {
  const { isLoggedIn } = useAuth()

  const navigate = useNavigate()
  const redirectIfNotAuth = async () => {
    if (isLoggedIn) {
      // Redirect home
      setTimeout(() => {
        navigate(`/crowdsale/my`)
      }, 1000)
    }
  }
  useEffect(() => {
    redirectIfNotAuth()
    return () => {}
  }, [isLoggedIn])
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "1rem 0" }}>
        Uh oh...
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
        style={{ margin: "2rem 0", maxWidth: "600px" }}
      >
        Click the sign in button on the toolbar and proceed to connect with your
        Plug wallet. If you don't have the Plug wallet the button will take you
        to the Chrome store to download it. After you have set up your wallet
        and you are logged in make sure you refresh this page.
      </Typography>
    </Box>
  )
}

export default SigninPageView
