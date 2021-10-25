import React, { useCallback } from "react"
import { Formik, Form } from "formik"
import { makeStyles } from "@mui/styles"
import { useNavigate, useParams } from "react-router-dom"
import { Typography, Button, Box, TextField } from "@mui/material"
import LoadingScreen from "./LoadingScreen"
import SendIcon from "@mui/icons-material/SendRounded"
import * as yup from "yup"
// import { crowdsale } from "canisters/crowdsale"
import useAuth from "../hooks/useAuth"

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      // width: "32ch",
    },
  },
}))

let validationSchema = yup.object().shape({
  contribution: yup.number().required().positive().integer(),
})

function ContributeForm() {
  const classes = useStyles()
  const { actor } = useAuth()
  let params = useParams()
  const navigate = useNavigate()
  // console.log("params", params)
  let crowdsaleId = params.id
  let initialValues = {
    contribution: "",
  }
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const handleMakeContribution = useCallback(
    async (crodwsaleId, contribution) => {
      setIsDisabled(true)
      let response = await actor.makeContribution(crowdsaleId, contribution)
      console.log("create res", response)
      let csId = response.ok
      setSuccess(true)
      // delay for user to read message
      setTimeout(() => {
        navigate(`/show/${csId}`)
      }, 5000)
    },
  )
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log("sumbit raw", parseInt(values.contribution))

        handleMakeContribution(crowdsaleId, parseFloat(values.contribution))
      }}
    >
      {(props) => (
        <Form className={classes.root} onSubmit={props.handleSubmit}>
          <Box padding="2rem">
            <TextField
              required
              id="contribution"
              label="Enter contribution"
              value={props.values.contribution}
              variant="outlined"
              onChange={props.handleChange}
              error={
                props.touched.contribution && Boolean(props.errors.contribution)
              }
              helperText={
                props.touched.contribution && props.errors.contribution
              }
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
                style={{ padding: "1rem" }}
                type="submit"
              >
                submit
              </Button>
            </Box>
            <Box
              margin="4rem 0"
              display={isDisabled === true ? "block" : "none"}
            >
              <LoadingScreen mode="mini" />
            </Box>
            <Box
              textAlign="center"
              margin="4rem 0"
              display={success === true ? "block" : "none"}
            >
              <Typography variant="subtitle1">
                Congratulations 🎉 🎉 🎉 <br />
                Your contribution has been sent . <br />
                One moment we are re-directing you to its page.
              </Typography>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  )
}

export default ContributeForm
