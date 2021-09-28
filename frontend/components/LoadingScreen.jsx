import React from "react"
import { Box } from "@mui/material"
import { motion } from "framer-motion"
import { alpha } from "@mui/material/styles"

import Logo from "./Logo"

function LoadingScreen({ mode }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={mode === "mini" ? "100%" : "100vh"}
    >
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeatDelay: 1,
          repeat: Infinity,
        }}
      >
        <Logo
          sx={{
            width: 64,
            height: 64,
          }}
        />
      </motion.div>

      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
        sx={{
          width: 100,
          height: 100,
          borderRadius: "25%",
          position: "absolute",
          border: (theme) =>
            `solid 3px ${alpha(theme.palette.primary.dark, 0.84)}`,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{
          ease: "linear",
          duration: 3.2,
          repeat: Infinity,
        }}
        sx={{
          width: 120,
          height: 120,
          borderRadius: "25%",
          position: "absolute",
          border: (theme) =>
            `solid 8px ${alpha(theme.palette.primary.dark, 0.84)}`,
        }}
      />
    </Box>
  )
}

export default LoadingScreen
