import React, { useCallback, useContext } from "react"
import SiteContext from "../context"
import { Formik, Form } from "formik"
import { useNavigate } from "react-router-dom"
import * as yup from "yup"
import { TextField, Button, Box, Typography, Paper } from "@mui/material"
import { makeStyles } from "@mui/styles"
import SendIcon from "@mui/icons-material/SendRounded"
import LoadingScreen from "./LoadingScreen"
import { crowdsale } from "canisters/crowdsale"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
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

function EditCrowsaleForm({ data, id }) {
  console.log("edit", data, id)
  let bi = Number(data.deadline) / 1000000
  let n = Number(bi)
  const classes = useStyles()
  const { state } = useContext(SiteContext)
  const navigate = useNavigate()
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [todaydate, setTodayDate] = React.useState(Date.now())
  let initialValues = {
    offer: data.offerPrice,
    deadline: n,
    // name: "",
  }

  // const handleCreateCrodwsale = useCallback(async (name, offer, deadline) => {
  //   setIsDisabled(true)

  //   console.log(name, offer, deadline)
  //   let response = await crowdsale.createCrowdsale({
  //     name: name,
  //     offerPrice: offer,
  //     deadline: deadline,
  //   })
  //   console.log(response)
  //   let csId = response.ok
  //   setSuccess(true)
  //   setTimeout(() => {
  //     navigate(`/crowdsale/show/${csId}`)
  //   }, 5000)
  // })
  console.log("state", state, initialValues)
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
        console.log(parseInt(id, values.offer), nano)
        // handleCreateCrodwsale(values.name, parseInt(values.offer), nano)
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
                onChange={(newValue) => {
                  console.log("edit new value", newValue)
                  let m = newValue.getTime()
                  props.setFieldValue("deadline", m)
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
            {props.errors.deadline && <div>{props.errors.deadline}</div>}
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
              style={{ padding: "1rem", marginLeft: "2rem" }}
              type="submit"
            >
              update
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
