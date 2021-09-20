import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import CreateCrowdsaleForm from "../../components/CreateCrowdsaleForm"

function CreatePageView() {
  return (
    <Box
      margin="6rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        Create a new Crowdsale
      </Typography>
      <Paper elevation={3}>
        <Box minWidth="50%" padding="3rem">
          <CreateCrowdsaleForm />
        </Box>
      </Paper>
    </Box>
  )
}

export default CreatePageView
