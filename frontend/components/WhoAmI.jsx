import React, { useCallback } from "react"
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import InfoIcon from "@mui/icons-material/InfoRounded"
import { crowdsale } from "canisters/crowdsale"

function WhoAmI() {
  const showInfo = useCallback(async () => {
    let response = await crowdsale.whoamiText()
    console.log("whoami", response)
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
