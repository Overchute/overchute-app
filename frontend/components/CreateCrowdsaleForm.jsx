import React, { useCallback, useContext } from "react"
import SiteContext from "../context"
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

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "32ch",
    },
  },
}))

let validationSchema = yup.object().shape({
  offer: yup.number().required().positive().integer(),
  deadline: yup.date().nullable(),
  // deadline: yup.number().required().positive().integer(),
  // name: yup.string().required(),
})

function CreateCrowdsaleForm() {
  const classes = useStyles()
  const { state } = useContext(SiteContext)
  const navigate = useNavigate()
  let today = new Date()
  let tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  // console.log("times", today, tomorrow, tomorrow.getTime())
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [todaydate, setTodayDate] = React.useState(Date.now())
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
      navigate(`/crowdsale/show/${csId}`)
    }, 5000)
  })
  console.log("state", state)
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
        let nano = values.deadline * 1000000
        console.log("sumbit nano", values.deadline, nano)
        handleCreateCrodwsale(parseFloat(values.offer), nano)
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
            >
              create crowdsale
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
