import React, { useCallback, useContext } from "react"

import { Formik, Form } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { TextField, Button, Box, Typography } from "@mui/material"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import DatePicker from "@mui/lab/DatePicker"
import {
  transformDateNanosToSecs,
  convertToNanoseconds,
} from "./utils/DateUtility"
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
      onSubmit={(values, actions, formikBag, FormikBag) => {
        // Validate if values are the same as before
        console.log("actions", values)

        if (
          initialValues.offer === values.offer &&
          initialValues.deadline === values.deadline
        ) {
          setMsg("You need to change at least one field")
          console.log("both are the same")
        } else {
          // if (initialValues.offer !== values.offer) {
          //   console.log(
          //     "Offers are not the same we can proceed with saving changes",
          //   )
          // }
          let nanos = convertToNanoseconds(values.deadline)
          handleUpdateCrodwsale(id, parseFloat(values.offer), nanos)
          console.log("At least one field is changed. Let's go")
        }
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
