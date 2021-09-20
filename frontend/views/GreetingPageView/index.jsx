import React, { useState, useCallback } from "react"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import LogoName from "../../assets/LogoName"
import { counter } from "canisters/counter"

function GreetingPageView() {
  const [inputStr, SetInputStr] = useState("")
  const [hello, setHello] = useState("")
  const doGreet = useCallback(async () => {
    if (inputStr !== "") {
      setHello("Greeting in progress...")
      let greeting = await counter.greet(inputStr)
      console.log(greeting)
      setHello(greeting)
    }
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
      <Typography variant="h4">Greetings from Internet Computer</Typography>
      <TextField
        label="Greeting"
        variant="outlined"
        value={inputStr}
        placeholder="Enter a greeting"
        onChange={(e) => SetInputStr(e.target.value)}
        style={{ margin: "2rem 0" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={doGreet}
        style={{ margin: "2rem 0" }}
      >
        send greeting
      </Button>
      <Typography variant="body1" color="secondary">
        {hello}
      </Typography>
    </Box>
  )
}

export default GreetingPageView
