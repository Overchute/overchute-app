import React from "react"
import { Box, Alert, AlertTitle } from "@mui/material"
import { today, utcMilllisecondsSinceEpoch } from "./utils/DateUtility"
import { format } from "date-fns-tz"

function DateNotice() {
  return (
    <Alert severity="info">
      <AlertTitle>Important notice</AlertTitle>
      The minimum deadline for a crowdsale is one day after creation.
      <br />
      The deadline's time for all crowdsales is at 11:59 pm UTC.
      <br />
      {`Local time : ${format(today, "MMM dd yyyy kk:mm:ss")}`} <br />
      {`UTC time : ${format(
        new Date(utcMilllisecondsSinceEpoch),
        "MMM dd yyyy kk:mm:ss",
      )}`}
    </Alert>
  )
}

export default DateNotice
