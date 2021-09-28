import React, { useCallback } from "react"
import { Box, Typography, Paper, Button } from "@mui/material"

function CrowdsaleInfo({ data }) {
  let bi = Number(data.deadline) / 1000000
  let n = Number(bi)
  let dt = new Date(n)
  console.log(n, dt)

  return (
    <>
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
        {`Deadline : ${dt}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Contributed amount : ${data.contributedAmount}`}
      </Typography>
    </>
  )
}

export default CrowdsaleInfo
