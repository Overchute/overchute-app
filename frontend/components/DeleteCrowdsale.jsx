import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/DeleteRounded"

function DeleteCrowdsale({ crowdsaleId }) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleRedirectToDeletePage = () => {
    navigate(`/crowdsale/delete/${crowdsaleId}`)
  }
  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="large"
        startIcon={<DeleteIcon />}
        style={{
          padding: "1rem",
          minWidth: "128px",
          //   display: edit === true ? "none" : "inline-flex",
        }}
        onClick={handleClickOpen}
      >
        delete
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete the following crowdsale?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {crowdsaleId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button color="error" onClick={handleRedirectToDeletePage} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteCrowdsale
