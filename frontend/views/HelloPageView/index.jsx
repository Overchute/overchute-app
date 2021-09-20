import React, { useState, useCallback } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import LogoName from "../../assets/LogoName"
import Button from "@mui/material/Button"
import { counter } from "canisters/counter"

function HelloPageView() {
  const [helloWorld, setHelloWorld] = useState("")

  const queryHelloWorld = useCallback(async () => {
    setHelloWorld("Query is in progress...")
    let hello = await counter.hello()
    setHelloWorld(hello)
  })
  return (
    <Box
      margin="6rem 0 0 0"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box style={{ display: "block", margin: "2rem 0" }} alt="logo">
        <LogoName primary="#16697A" secondary="gold" />
      </Box>
      <Typography variant="h4">Hello World from Internet Computer</Typography>
      <Button
        variant="outlined"
        color="primary"
        children="query hello world"
        onClick={queryHelloWorld}
        style={{ margin: "2rem 0" }}
      />
      <Typography
        style={{ margin: "2rem 0" }}
        color="secondary"
        variant="body1"
        children={helloWorld}
      />
    </Box>
  )
}

export default HelloPageView
