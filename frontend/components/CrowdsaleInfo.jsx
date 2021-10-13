import React from "react"
import { Typography } from "@mui/material"
import { transformDateNanosToSecs } from "./utils/DateUtility"

function CrowdsaleInfo({ data }) {
  let created = new Date(transformDateNanosToSecs(data.createdAt))
  let deadline = new Date(transformDateNanosToSecs(data.deadline))

  return (
    <>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Id : ${data.crowdsaleId}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Created at : ${created}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Creator : ${data.creator}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Deadline : ${deadline}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Offer price : ${data.offerPrice}`}
      </Typography>
      <Typography variant="body1" style={{ margin: "1rem 0" }}>
        {`Contributed amount : ${data.contributedAmount}`}
      </Typography>
    </>
  )
}

export default CrowdsaleInfo
