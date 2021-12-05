import React from "react"
import { Alert, AlertTitle } from "@mui/material"
import { today, utcMilllisecondsSinceEpoch } from "./utils/DateUtility"
import { format } from "date-fns-tz"

function DateNotice() {
  return (
    <Alert severity="info">
      <AlertTitle>Important notice</AlertTitle>
      The deadline for a crowdsale must be at least one day after creation.
      <br />
      All crowdsales end at 11:59 UTC.
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
