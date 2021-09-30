import React, { useCallback, useContext } from "react"
import { zonedTimeToUtc } from "date-fns-tz"
import { Formik, Form } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { TextField, Button, Box, Typography } from "@mui/material"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import DatePicker from "@mui/lab/DatePicker"
import {
  transformDateNanosToSecs,
  today,
  tomorrow,
} from "./utils/DateTransformer"

import { makeStyles } from "@mui/styles"
import SendIcon from "@mui/icons-material/SendRounded"
import LoadingScreen from "./LoadingScreen"
import { crowdsale } from "canisters/crowdsale"

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "32ch",
    },
  },
}))

function EditCrowsaleForm({ data, id }) {
  const classes = useStyles()
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [msg, setMsg] = React.useState("")
  const [minDeadline, setMinDeadline] = React.useState(
    new Date(transformDateNanosToSecs(data.deadline)),
  )

  let validationSchema = yup.object().shape({
    offer: yup
      .number()
      .max(data.offerPrice, "New offer has to be less or equal than previous")
      .positive()
      .integer()
      .required(),
    deadline: yup.date().nullable(),
  })
  let initialValues = {
    offer: data.offerPrice,
    deadline: new Date(transformDateNanosToSecs(data.deadline)),
  }

  const handleUpdateCrodwsale = useCallback(async (id, offer, deadline) => {
    setIsDisabled(true)

    console.log(offer, deadline)
    let response = await crowdsale.update({
      crowdsaleId: id,
      offerPrice: offer,
      deadline: deadline,
    })
    console.log("update res", response)
    let csId = response.ok
    setSuccess(true)
    setTimeout(() => {
      navigate(`/crowdsale/show/${id}`)
    }, 5000)
  })
  console.log("edit view", initialValues)
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Validate if values are the same as before
        const now = new Date()

        const utcMilllisecondsSinceEpoch =
          now.getTime() + now.getTimezoneOffset() * 60 * 1000
        const sametimeTomorrowUTC = utcMilllisecondsSinceEpoch + 86400000
        var d2 = new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate() + 1,
          23,
          59,
          0,
        )
        console.log(
          utcMilllisecondsSinceEpoch,
          // new Date(utcMilllisecondsSinceEpoch).toUTCString(),
          // new Date(sametimeTomorrowUTC).toUTCString(),
          new Date(utcMilllisecondsSinceEpoch),
          new Date(sametimeTomorrowUTC),
          d2,
          d2.getTime(),
          sametimeTomorrowUTC,
          d2.getTime() - sametimeTomorrowUTC,
        )
        // let date = new Date()
        // let zulu = new Date().toISOString()
        // let timezone = date.getTimezoneOffset()
        // const utcDate = zonedTimeToUtc(date, `${timezone}`)
        // console.log(date, timezone)
        // console.log(utcDate, zulu, Date.parse(date) * 1000000)

        // let nano = values.deadline.getTime() * 1000000
        // console.log(
        //   initialValues.offer,
        //   values.offer,

        //   initialValues.deadline,

        //   values.deadline,
        // )
        if (
          initialValues.offer === values.offer &&
          initialValues.deadline === values.deadline
        ) {
          console.log("both are the same")
        } else {
          if (initialValues.offer !== values.offer) {
            console.log("offers are not the same")
          }
          // if (initialValues.deadline !== values.deadline) {
          //   let initEpoch = parseFloat(initialValues.deadline.getTime())
          //   let newEpoch = parseFloat(values.deadline.getTime())
          //   let initialDate =
          //     initEpoch.getUTCDate() +
          //     "-" +
          //     (initEpoch.getUTCMonth() + 1) +
          //     "-" +
          //     initEpoch.getUTCFullYear()
          //   let newDate =
          //     newEpoch.getUTCDate() +
          //     "-" +
          //     (newEpoch.getUTCMonth() + 1) +
          //     "-" +
          //     newEpoch.getUTCFullYear()
          //   console.log("deadline are not the same", initialDate, newDate)
          // }
        }

        // if (
        //   initialValues.offer !== values.offer ||
        //   initialValues.deadline !== values.deadline
        // ) {
        //   // console.log("one field is changed")
        //   let newOffer = parseFloat(values.offer)
        //   let nano = values.deadline.getTime() * 1000000
        //   handleUpdateCrodwsale(id, newOffer, nano)
        // } else {
        //   setMsg("You need to change at least one field to update crowdsale")
        // }
      }}
    >
      {(props) => (
        <Form className={classes.root} onSubmit={props.handleSubmit}>
          <Box>
            <Typography
              variant="h6"
              children="Edit :"
              style={{ margin: "1rem" }}
            />

            <TextField
              required
              id="offer"
              label="Enter Offer"
              value={props.values.offer}
              variant="outlined"
              onChange={(e) => {
                props.setFieldValue("offer", e.target.value)
                setMsg("")
              }}
              error={props.touched.offer && Boolean(props.errors.offer)}
              helperText={props.touched.offer && props.errors.offer}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                required
                id="deadline"
                label="Enter Deadline"
                value={props.values.deadline}
                minDate={minDeadline}
                inputProps={{ readOnly: true }}
                onChange={(newValue) => {
                  props.setFieldValue("deadline", newValue)
                  setMsg("")
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            {props.errors.deadline && <div>{props.errors.deadline}</div>}
          </Box>
          <Typography
            variant="subtitle1"
            color="error"
            children={msg}
            style={{ marginLeft: "2rem" }}
          />
          <Box
            style={{
              textAlign: "right",
              marginTop: "2rem",
              marginRight: "1rem",
              display: isDisabled === true ? "none" : "block",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<SendIcon />}
              style={{ padding: "1rem", marginLeft: "2rem" }}
              type="submit"
            >
              update
            </Button>
          </Box>
          <Box margin="4rem 0" display={isDisabled === true ? "block" : "none"}>
            <LoadingScreen mode="mini" />
          </Box>
          <Box
            textAlign="center"
            margin="4rem 0"
            display={success === true ? "block" : "none"}
          >
            <Typography variant="subtitle1">
              Congratulations 🎉 🎉 🎉 <br />
              Your crowdsale has been updated. <br />
              One moment we are re-directing you to its page.
            </Typography>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default EditCrowsaleForm
