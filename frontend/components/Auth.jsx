import React, { useEffect, useState, useContext, useRef } from "react"
import { AuthContext } from "../context/AuthContext"
import {
  Box,
  Button,
  Typography,
  Hidden,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material"
import { AuthClient } from "@dfinity/auth-client"
import InfinityIcon from "@mui/icons-material/AllInclusiveOutlined"
import ExitIcon from "@mui/icons-material/ExitToAppOutlined"
import InfoIcon from "@mui/icons-material/InfoOutlined"
import IconButton from "@mui/material/IconButton"
import useAuth from "../hooks/useAuth"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function Auth() {
  const {
    isAuthenticated,
    signedIn,
    principal,
    identity,
    client,
    signIn,
    signOut,
  } = useAuth()

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  console.log(
    "auth widget",
    isAuthenticated,
    signedIn,
    principal,
    identity,
    client,
  )
  return (
    <Box>
      {!signedIn && client ? (
        <Button
          variant="outlined"
          color="neutral"
          size="medium"
          endIcon={<InfinityIcon />}
          onClick={signIn}
        >
          Sign in
        </Button>
      ) : null}
      {signedIn ? (
        <Box>
          <Hidden mdDown>
            <Typography
              variant="subtitle1"
              style={{
                display: "inline",
                margin: "1rem",
                backgroundColor: "rgba(22,105,122,.4)",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              Signed in as : {principal}
            </Typography>

            <Button
              variant="outlined"
              color="neutral"
              size="medium"
              endIcon={<ExitIcon />}
              onClick={signOut}
            >
              Sign out
            </Button>
          </Hidden>
          <Hidden lgUp>
            <IconButton onClick={handleClickOpen} aria-label="info">
              <InfoIcon />
            </IconButton>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                Signed in as:
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {principal}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  endIcon={<ExitIcon />}
                  onClick={() => {
                    signOut()
                    handleClose()
                  }}
                >
                  Sign out
                </Button>
              </DialogActions>
            </Dialog>
          </Hidden>
        </Box>
      ) : null}
    </Box>
  )
}

export { Auth }
