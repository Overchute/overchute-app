import React, { useCallback } from "react"
import { useFormik } from "formik"
import { useHistory } from "react-router-dom"
import * as yup from "yup"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Box from "@material-ui/core/Box"
import { makeStyles } from "@material-ui/core/styles"
import SendIcon from "@material-ui/icons/SendRounded"
import LoadingScreen from "./LoadingScreen"
import { crowdsale } from "canisters/crowdsale"
import Typography from "@material-ui/core/Typography"

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
  deadline: yup.number().required().positive().integer(),
  name: yup.string.required,
})

function CreateCrowdsaleForm() {
  const classes = useStyles()
  let history = useHistory()
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const formik = useFormik({
    initialValues: {
      offer: "",
      deadline: "",
      name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(
        typeof values.name,
        typeof parseInt(values.offer),
        typeof parseInt(values.deadline),
      )
      handleCreateCrodwsale(
        values.name,
        parseInt(values.offer),
        parseInt(values.deadline),
      )
    },
  })
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
    <form
      className={classes.root}
      onSubmit={formik.handleSubmit}
      autoComplete="off"
    >
      <Box>
        <Box>
          <TextField
            required
            id="name"
            label="Enter Name"
            value={formik.values.name}
            variant="outlined"
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Box>
        <TextField
          required
          id="offer"
          label="Enter Offer"
          value={formik.values.offer}
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.offer && Boolean(formik.errors.offer)}
          helperText={formik.touched.offer && formik.errors.offer}
        />
        <TextField
          required
          id="deadline"
          label="Enter Deadline"
          value={formik.values.deadline}
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.deadline && Boolean(formik.errors.deadline)}
          helperText={formik.touched.deadline && formik.errors.deadline}
        />
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

      {/* <Box
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
          onClick={handleGetAllCrodwsales}
        >
          getall crowdsales
        </Button>
      </Box> */}
    </form>
  )
}

export default CreateCrowdsaleForm
