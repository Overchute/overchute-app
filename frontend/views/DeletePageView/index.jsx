import React, { useCallback, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import LoadingScreen from "../../components/LoadingScreen"
// import { crowdsale } from "canisters/crowdsale"
import useAuth from "../../hooks/useAuth"

function DeletePageView() {
  let params = useParams()
  const { actor } = useAuth()
  const navigate = useNavigate()
  // console.log("params", params)
  let crowdsaleId = params.id

  const [success, setSuccess] = React.useState(false)

  const handleDeleteCrowdsale = useCallback(async (crowdsaleId) => {
    // console.log("delete now", crowdsaleId)
    let response = await actor.delete(crowdsaleId)
    // let response = await crowdsale.delete(crowdsaleId)
    // console.log("delete res", response)
    setSuccess(true)
    // delay for user to read message
    setTimeout(() => {
      navigate(`/`)
    }, 6000)
  })
  useEffect(() => {
    handleDeleteCrowdsale(crowdsaleId)
    return () => {}
    // eslint-disable-next-line
  }, [])
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        Deleting
      </Typography>
      <Typography variant="h5">Crowdsale : {crowdsaleId}</Typography>
      <Box margin="6rem 0 0 0">
        <LoadingScreen mode="mini" />
      </Box>
      <Box
        textAlign="center"
        margin="4rem 0"
        display={success === true ? "block" : "none"}
      >
        <Typography variant="subtitle1">
          Your crowdsale has been deleted. <br />
          Feel free to create a new crowdsale anytime 😎 . <br />
          One moment we are re-directing you to our home page.
        </Typography>
      </Box>
    </Box>
  )
}

export default DeletePageView
