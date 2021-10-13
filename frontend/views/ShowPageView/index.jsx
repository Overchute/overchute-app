import React, { useCallback, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Box, Typography, Button, Paper, Grid } from "@mui/material"
import LoadingScreen from "../../components/LoadingScreen"
import CrowdsaleInfo from "../../components/CrowdsaleInfo"
import NoCrowdsaleFound from "../../components/NoCrowdsaleFound"
import DeleteCrowdsale from "../../components/DeleteCrowdsale"
import ContributeIcon from "@mui/icons-material/AddBoxOutlined"
import EditIcon from "@mui/icons-material/ModeEditOutlineRounded"
import { crowdsale } from "canisters/crowdsale"

function ShowPageView() {
  let params = useParams()

  let crowdsaleId = params.id
  // console.log("show csi", crowdsaleId)
  const [data, setData] = React.useState([])

  const [isDisabled, setIsDisabled] = React.useState(false)

  const getCrowdsaleById = useCallback(async (crowdsaleId) => {
    let response = await crowdsale.getCrowdsale(crowdsaleId)
    console.log("show response", response)
    response.ok !== undefined ? setData([response.ok]) : setData(["none"])
    // setData(response)
    // console.log(response)
  })

  useEffect(() => {
    getCrowdsaleById(crowdsaleId)
    return () => {}
    // eslint-disable-next-line
  }, [])
  // console.log("data length in show crowdsale", data, data.length, crowdsaleId)
  return (
    <>
      {data.length > 0 && data[0] !== "none" && (
        <Box
          margin="3rem 0 0 0"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h2" style={{ margin: "1rem 0" }}>
            Crowdsale
          </Typography>
          <Typography variant="h6" style={{ margin: "2rem 0" }}>
            {`Id : ${crowdsaleId}`}
          </Typography>
          <Paper elevation={3}>
            <Box padding={{ xs: "1rem", sm: "2rem", md: "3rem" }}>
              <Box padding="3rem">
                <CrowdsaleInfo data={data[0]} />
              </Box>
              <Box
                margin="4rem 0"
                display={isDisabled === true ? "block" : "none"}
              >
                <LoadingScreen mode="mini" />
              </Box>
              <Box padding="3rem">
                <Grid container spacing={4}>
                  <Grid item xs="12" sm="12" md="12" lg="4" xl="4">
                    <DeleteCrowdsale crowdsaleId={crowdsaleId} />
                  </Grid>
                  <Grid item xs="12" sm="12" md="12" lg="4" xl="4">
                    <Button
                      component={Link}
                      to={`/crowdsale/edit/${crowdsaleId}/${data[0].offerPrice}/${data[0].deadline}`}
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
                  <Grid item xs="12" sm="12" md="12" lg="4" xl="4">
                    <Button
                      component={Link}
                      to={`/crowdsale/contribute/${crowdsaleId}`}
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
                </Grid>
              </Box>
            </Box>
          </Paper>
          <Box height="800px"></Box>
        </Box>
      )}
      {data.length === 0 && <LoadingScreen />}
      {data[0] === "none" && <NoCrowdsaleFound />}
    </>
  )
}

export default ShowPageView
