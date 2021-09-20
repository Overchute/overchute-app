import React from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"

function CrowdsaleInfo({ data }) {
  return (
    <Paper elevation={3}>
      <Box minWidth="50%" padding="3rem">
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Id : ${data.crowdsaleId}`}
        </Typography>
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Created at : ${data.createdAt}`}
        </Typography>
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Author : ${data.name}`}
        </Typography>
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Offer price : ${data.offerPrice}`}
        </Typography>
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Deadline : ${data.deadline}`}
        </Typography>
        <Typography variant="body1" style={{ margin: "1rem 0" }}>
          {`Contributed amount : ${data.contributedAmount}`}
        </Typography>
      </Box>
    </Paper>
  )
}

export default CrowdsaleInfo