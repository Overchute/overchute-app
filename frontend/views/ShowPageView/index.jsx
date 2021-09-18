import React, { useCallback, useEffect } from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import LoadingScreen from "../../components/LoadingScreen"
import CrowdsaleInfo from "../../components/CrowdsaleInfo"
import { crowdsale } from "canisters/crowdsale"

function ShowPageView({ match }) {
  let crowdsaleId = match.params.id
  console.log("show csi", crowdsaleId)
  const [data, setData] = React.useState([])

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
          <CrowdsaleInfo data={data[0]} />
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
            Looks like we couldn't find the crowdsale you were looking for.{" "}
            <br />
            Please review the crowdsale you entered and try again.
          </Typography>
        </Box>
      )}
    </>
  )
}

export default ShowPageView
