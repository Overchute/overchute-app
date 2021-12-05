import React, { useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import { Box, Typography, Button, Paper, Grid } from "@mui/material"
import LoadingScreen from "../../components/LoadingScreen"
import EditIcon from "@mui/icons-material/ModeEditOutlineRounded"
import ContributeIcon from "@mui/icons-material/AddBoxOutlined"
// import { crowdsale } from "canisters/crowdsale"
import useAuth from "../../hooks/useAuth"

function ListPageView() {
  const { actor, principal } = useAuth()
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
  console.log("list")
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
          console.log(
            "item",
            i,
            "item identity",
            i.identity,
            "principal",
            principal,
          )
          return (
            <Paper
              key={x}
              elevation={3}
              style={{ margin: "2rem 0", minWidth: "50%" }}
            >
              <Box minWidth="50%" padding="3rem">
                <Typography variant="body1" gutterBottom>
                  {`Crowdsale Id: ${i.crowdsaleId}`}
                </Typography>
                {/* <Typography variant="body1" gutterBottom>
                  {dt.toString()}
                </Typography> */}
                <Typography variant="body1" style={{ margin: "1rem 0" }}>
                  {`Created at : ${toDate(i.createdAt)}`}
                </Typography>
                {/* <Typography variant="body1" style={{ margin: "1rem 0" }}>
                  {`Creator : ${i.creator}`}
                </Typography> */}
                <Typography variant="body1" style={{ margin: "1rem 0" }}>
                  {`Deadline : ${toDate(i.deadline)}`}
                </Typography>
                <Typography variant="body1" style={{ margin: "1rem 0" }}>
                  {`Asking price : ${i.offerPrice}`}
                </Typography>
                <Typography variant="body1" style={{ margin: "1rem 0" }}>
                  {`Contributed amount : ${i.contributedAmount}`}
                </Typography>
                <Grid container spacing={4} sx={{ marginTop: "2rem" }}>
                  {i.identity === principal && (
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                      <Button
                        component={Link}
                        to={`/crowdsale/edit/${i.crowdsaleId}/${i.offerPrice}/${i.deadline}`}
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<EditIcon />}
                        style={{
                          padding: "1rem",
                          minWidth: "128px",
                        }}
                      >
                        edit
                      </Button>
                    </Grid>
                  )}

                  {i.identity !== principal && (
                    <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                      <Button
                        component={Link}
                        to={`/crowdsale/contribute/${i.crowdsaleId}`}
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<ContributeIcon />}
                        style={{
                          padding: "1rem",
                          minWidth: "128px",
                        }}
                      >
                        contribute
                      </Button>
                    </Grid>
                  )}
                </Grid>
                {/* <Button
                  variant="outlined"
                  color="primary"
                  component={Link}
                  to={`/show/${i.crowdsaleId}`}
                  style={{ marginTop: "2rem" }}
                >
                  Details
                </Button> */}
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

const toDate = (v) => {
  let bi = Number(v) / 1000000
  let dt = new Date(bi)

  return dt
}

export default ListPageView
