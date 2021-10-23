import React, { useCallback } from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/InfoRounded"
// import { actor } from "canisters/crowdsale"
import useAuth from "../hooks/useAuth"
import { crowdsale } from "../../.dfx/local/canisters/crowdsale"
import { actorController } from "../agent"
// import { useAuthClient } from "../hooks/useAuthClient"

const Crowd = actorController

function WhoAmI() {
  // const { authClient, actor } = useAuthClient()
  const { authClient, actor } = useAuth()

  // console.log("who am i client", authClient, actor)
  const showInfo = useCallback(async () => {
    // let response = await crowdsale.whoamiText()
    let response = await actor.whoamiText()
    // console.log("whoami actor", response)
    // let response = await (await Crowd.actor).whoamiText()
    console.log("who am i?  ", response)
  })
  return (
    <>
      <Divider />
      <List>
        <ListItem button onClick={showInfo}>
          <ListItemIcon sx={{ pl: { xs: 0, sm: 1 } }}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary={"Who Am I"} />
        </ListItem>
      </List>
    </>
  )
}

export default WhoAmI
