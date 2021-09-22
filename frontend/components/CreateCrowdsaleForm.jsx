import React, { useCallback } from "react"
import { Formik, Form, useFormik } from "formik"
import { useHistory } from "react-router-dom"
import * as yup from "yup"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import { makeStyles } from "@mui/styles"
import SendIcon from "@mui/icons-material/SendRounded"
import LoadingScreen from "./LoadingScreen"
import { crowdsale } from "canisters/crowdsale"
import Typography from "@mui/material/Typography"
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
  let history = useHistory()
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [todaydate, setTodayDate] = React.useState(Date.now())
  let initialValues = {
    offer: "",
    deadline: todaydate,
    // name: "",
  }
  // const formik = useFormik({
  //   // initialValues: {
  //   //   offer: "",
  //   //   deadline: "",
  //   //   name: "",
  //   // },
  //   validationSchema: validationSchema,
  //   onSubmit: (values) => {
  //     console.log(
  //       typeof values.name,
  //       typeof parseInt(values.offer),
  //       typeof parseInt(values.deadline),
  //     )
  //     handleCreateCrodwsale(
  //       values.name,
  //       parseInt(values.offer),
  //       parseInt(values.deadline),
  //     )
  //   },
  // })
  const handleCreateCrodwsale = useCallback(async (name, offer, deadline) => {
    setIsDisabled(true)

    console.log(name, offer, deadline)
    let response = await crowdsale.createCrowdsale({
      name: name,
      offerPrice: offer,
      deadline: deadline,
    })
    console.log(response)
    let csId = response.ok
    setSuccess(true)
    setTimeout(() => {
      history.push(`/crowdsale/show/${csId}`)
    }, 5000)
  })

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log(
          values.name,
          parseInt(values.offer),
          values.deadline.getTime(),
        )
        let nano = values.deadline.getTime() * 1000000
        handleCreateCrodwsale(values.name, parseInt(values.offer), nano)
      }}
      render={(props) => (
        <Form className={classes.root}>
          <Box>
            {/* <Box>
              <TextField
                required
                id="name"
                label="Enter Name"
                value={props.values.name}
                variant="outlined"
                onChange={props.handleChange}
                error={props.touched.name && Boolean(props.errors.name)}
                helperText={props.touched.name && props.errors.name}
              />
            </Box> */}
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
            {/* <TextField
              required
              id="deadline"
              label="Enter Deadline"
              value={props.values.deadline}
              variant="outlined"
              onChange={props.handleChange}
              error={props.touched.deadline && Boolean(props.errors.deadline)}
              helperText={props.touched.deadline && props.errors.deadline}
            /> */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                required
                id="deadline"
                label="Enter Deadline"
                value={props.values.deadline}
                onChange={(newValue) => {
                  props.setFieldValue("deadline", newValue)
                  // console.log("NEW DATE", newValue, newValue.getTime())
                  // if (newValue === "") {
                  //   props.setFieldValue("deadline", todaydate)
                  // } else {
                  //   props.setFieldValue("deadline", newValue)
                  // }
                }}
                error={props.touched.deadline && Boolean(props.errors.deadline)}
                helperText={props.touched.deadline && props.errors.deadline}
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
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SendIcon />}
              style={{ padding: "1rem" }}
              type="submit"
            >
              submit crowdsale
            </Button>
          </Box>
          <Box margin="4rem 0" display={isDisabled === true ? "block" : "none"}>
            <LoadingScreen />
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
    />
  )
}

export default CreateCrowdsaleForm
