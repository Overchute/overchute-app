import React, { useCallback } from "react"
import { convertToNanoseconds, tomorrow } from "./utils/DateUtility"
import { Formik, Form } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { TextField, Button, Box, Typography } from "@mui/material"
import { makeStyles } from "@mui/styles"
import SendIcon from "@mui/icons-material/SendRounded"
import LoadingScreen from "./LoadingScreen"
import { crowdsale } from "canisters/crowdsale"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import DatePicker from "@mui/lab/DatePicker"
import DateNotice from "./DateNotice"

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      // width: "32ch",
    },
  },
}))

let validationSchema = yup.object().shape({
  offer: yup.number().required().positive().integer(),
  deadline: yup.date().nullable(),
})

function CreateCrowdsaleForm() {
  const classes = useStyles()
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [minDeadline, setMinDeadline] = React.useState(tomorrow)
  let initialValues = {
    offer: "",
    deadline: minDeadline,
  }

  const handleCreateCrodwsale = useCallback(async (offer, deadline) => {
    setIsDisabled(true)

    console.log(offer, deadline)
    let response = await crowdsale.createCrowdsale({
      offerPrice: offer,
      deadline: deadline,
    })
    console.log("create res", response)
    let csId = response.ok
    setSuccess(true)
    // delay for user to read message
    setTimeout(() => {
      navigate(`/show/${csId}`)
    }, 5000)
  })
  console.log("from create", crowdsale)
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // console.log(
        //   "sumbit raw",
        //   parseInt(values.offer),
        //   values.deadline,
        // )

        let nanos = convertToNanoseconds(values.deadline)
        // console.log("sumbit deadline", values.deadline, nanos)
        handleCreateCrodwsale(parseFloat(values.offer), nanos)
      }}
    >
      {(props) => (
        <Form className={classes.root} onSubmit={props.handleSubmit}>
          <Box>
            <TextField
              required
              id="offer"
              label="Enter Offer"
              value={props.values.offer}
              variant="outlined"
              onChange={props.handleChange}
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
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
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
              style={{ padding: "1rem" }}
              type="submit"
              disabled={!props.isValid || !props.dirty ? true : false}
            >
              create crowdsale
            </Button>
          </Box>
          <Box margin="3rem 0" display={isDisabled === true ? "none" : "block"}>
            <DateNotice />
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
              Your crowdsale has been created. <br />
              One moment we are re-directing you to its page.
            </Typography>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default CreateCrowdsaleForm
