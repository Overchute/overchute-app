import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography, Paper } from "@mui/material"
import ContributeForm from "../../components/ContributeForm"

function ContributePageView() {
  let params = useParams()
  const navigate = useNavigate()
  // console.log("params", params)
  let crowdsaleId = params.id
  return (
    <Box
      margin="3rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "1rem 0" }}>
        Crowdsale
      </Typography>
      <Typography variant="h6" style={{ margin: "2rem 0" }}>
        {`Id : ${crowdsaleId}`}
      </Typography>
      <Paper elevation={3}>
        <Box padding="3rem">
          <ContributeForm crowdsaleId={crowdsaleId} />
        </Box>
      </Paper>
    </Box>
  )
}

export default ContributePageView
