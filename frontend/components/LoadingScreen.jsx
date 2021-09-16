import clsx from "clsx"
import React from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import Logo from "./Logo"
import { makeStyles, alpha } from "@material-ui/core/styles"

// ----------------------------------------------------------------------

const TRANSITION = {
  ease: "linear",
  duration: 3.2,
  loop: Infinity,
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: theme.palette.background.default,
  },
  box: {
    position: "absolute",
    borderRadius: "25%",
  },
  inner: {
    width: 100,
    height: 100,
    border: `solid 3px ${alpha(theme.palette.primary.dark, 0.24)}`,
  },
  outside: {
    width: 120,
    height: 120,
    border: `solid 8px ${alpha(theme.palette.primary.dark, 0.24)}`,
  },
}))

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
  className: PropTypes.string,
}

function LoadingScreen({ className, ...other }) {
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)} {...other}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          flip: Infinity,
          repeatDelay: 1,
        }}
        style={{ paddingTop: "22px" }}
      >
        <Logo sx={{ height: 64 }} />
      </motion.div>

      <motion.div
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={TRANSITION}
        className={clsx(classes.box, classes.inner)}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ["25%", "25%", "50%", "50%", "25%"],
        }}
        transition={{
          ease: "linear",
          duration: 3.2,
          loop: Infinity,
        }}
        className={clsx(classes.box, classes.outside)}
      />
    </div>
  )
}

export default LoadingScreen
