import React from "react"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
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
