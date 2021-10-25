import React, { useCallback } from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/InfoRounded"
import useAuth from "../hooks/useAuth"

function WhoAmI() {
  const { actor } = useAuth()

  const showInfo = useCallback(async () => {
    let response = await actor.whoamiText()
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
