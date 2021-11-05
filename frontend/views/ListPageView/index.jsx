import React, { useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Box, Typography, Button, Paper } from "@mui/material"
import LoadingScreen from "../../components/LoadingScreen"
// import { crowdsale } from "canisters/crowdsale"
import useAuth from "../../hooks/useAuth"

function ListPageView() {
  const { actor } = useAuth()
  const [data, setData] = React.useState([])
  const [isDisabled, setIsDisabled] = React.useState(false)
  const handleListAllCrodwsales = useCallback(async () => {
    setIsDisabled(true)
    let res = await actor.getAllCrowdsales()
    // let res = await crowdsale.getAllCrowdsales()
    res.length > 0 ? setData(res) : setData(["none"])

    console.log(res)
    setIsDisabled(false)
  })
  useEffect(() => {
    handleListAllCrodwsales()
    return () => {}
  }, [])
  // console.log("data at list crowdsales", data, data.length)
  return (
    <Box
      margin="1rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Typography variant="h2" style={{ margin: "2rem 0" }}>
        Crowdsale List
      </Typography>

      {data.length > 0 &&
        data[0] !== "none" &&
        data.map((i, x) => {
          console.log(i)
          let bi = Number(i.deadline) / 1000000
          let dt = new Date(bi)
          console.log(new Date(bi))
          return (
            <Paper
              key={x}
              elevation={3}
              style={{ margin: "2rem 0", minWidth: "50%" }}
            >
              <Box minWidth="50%" padding="3rem">
                <Typography variant="body1" gutterBottom>
                  {i.crowdsaleId}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {dt.toString()}
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/show/${i.crowdsaleId}`}
                  style={{ marginTop: "2rem" }}
                >
                  Details
                </Button>
              </Box>
            </Paper>
          )
        })}
      {data.length > 0 && data[0] === "none" && (
        <>
          <Typography variant="h2" gutterBottom>
            😨
          </Typography>
          <Typography variant="h5" children="Sorry, there are no crowdsales" />
        </>
      )}
      {!data.length && <LoadingScreen />}
    </Box>
  )
}

export default ListPageView
