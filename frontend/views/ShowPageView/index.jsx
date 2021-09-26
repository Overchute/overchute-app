import React, { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
// import { makeStyles } from "@mui/styles"
import { Box, Typography, Button, Paper } from "@mui/material"

import LoadingScreen from "../../components/LoadingScreen"
import CrowdsaleInfo from "../../components/CrowdsaleInfo"
import EditCrowdsaleForm from "../../components/EditCrowdsaleForm"
import DeleteIcon from "@mui/icons-material/DeleteRounded"
import EditIcon from "@mui/icons-material/ModeEditOutlineRounded"
import { crowdsale } from "canisters/crowdsale"

function ShowPageView() {
  let params = useParams()
  // console.log("params", params)
  let crowdsaleId = params.id
  // console.log("show csi", crowdsaleId)
  const [data, setData] = React.useState([])
  const [edit, setEdit] = React.useState(false)

  const getCrowdsaleById = useCallback(async (crowdsaleId) => {
    let response = await crowdsale.getCrowdsale(crowdsaleId)
    console.log("show response", response)
    response.ok !== undefined ? setData([response.ok]) : setData(["none"])
    // setData(response)
    // console.log(response)
  })
  useEffect(() => {
    getCrowdsaleById(crowdsaleId)
    // eslint-disable-next-line
  }, [])
  console.log("data length in show crowdsale", data, data.length, crowdsaleId)
  return (
    <>
      {data.length > 0 && data[0] !== "none" && (
        <Box
          margin="6rem 0 0 0"
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
            <Box minWidth="50%" padding="3rem">
              {!edit && <CrowdsaleInfo data={data[0]} />}
              {edit && <EditCrowdsaleForm id={crowdsaleId} data={data[0]} />}
            </Box>
            <Box
              minWidth="50%"
              justifyContent="center"
              margin="2rem"
              display={edit === true ? "none" : "flex"}
            >
              <Button
                variant="contained"
                color="error"
                size="large"
                startIcon={<DeleteIcon />}
                style={{
                  padding: "1rem",
                  minWidth: "128px",
                  display: edit === true ? "none" : "inline-flex",
                }}
                onClick={() => console.log("delete")}
              >
                delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<EditIcon />}
                style={{
                  padding: "1rem",
                  marginLeft: "2rem",
                  minWidth: "128px",
                }}
                onClick={() => setEdit(true)}
              >
                edit
              </Button>
            </Box>
          </Paper>
          {/* {!edit && (
            <>
              <CrowdsaleInfo data={data[0]} />
              <Box
                minWidth="50%"
                display="flex"
                justifyContent="center"
                margin="2rem"
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<EditIcon />}
                  style={{ padding: "1rem", minWidth: "128px" }}
                  onClick={() => {
                    setEdit(true)
                  }}
                >
                  edit
                </Button>
              </Box>
            </>
          )} */}
          {/* {edit && (
            <>
              <EditCrowdsaleForm data={data[0]} />
              <Box
                minWidth="50%"
                display="flex"
                justifyContent="center"
                margin="2rem"
              >
                
              </Box>
            </>
          )} */}
        </Box>
      )}
      {data.length === 0 && <LoadingScreen />}
      {data[0] === "none" && (
        <Box
          margin="6rem 0 0 0"
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
          <Typography variant="h3" style={{ margin: "2rem 0" }}>
            🤔
          </Typography>
          <Typography
            align="center"
            variant="subtitle1"
            style={{ margin: "2rem 0" }}
          >
            Looks like we couldn't find the crowdsale you were looking for.
            <br />
            Please review the crowdsale you entered and try again.
          </Typography>
        </Box>
      )}
    </>
  )
}

export default ShowPageView
