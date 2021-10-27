import React from "react"
import { useParams } from "react-router-dom"
import { Box, Typography, Paper } from "@mui/material"
import EditCrowdsaleForm from "../../components/EditCrowdsaleForm"

function EditPageView() {
  let params = useParams()
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "1rem 0" }}>
        Edit crowdsale
      </Typography>
      <Typography variant="h6" style={{ margin: "2rem 0" }}>
        {`Id : ${params.id}`}
      </Typography>
      <Paper elevation={3}>
        <Box padding="3rem">
          {params.id !== undefined && (
            <EditCrowdsaleForm
              id={params.id}
              data={{
                offerPrice: params.offer,
                deadline: params.deadline,
              }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default EditPageView
