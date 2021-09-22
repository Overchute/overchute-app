import React from "react"
// material
import { useTheme } from "@mui/material/styles"
import { Box } from "@mui/material"

// ----------------------------------------------------------------------

export default function Logo({ sx }) {
  // const theme = useTheme()
  //   const PRIMARY_LIGHT = theme.palette.primary.light
  //   const PRIMARY_MAIN = theme.palette.primary.main
  //   const PRIMARY_DARK = theme.palette.primary.dark

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1015.09 1015.09">
        <path
          d="M425.76,258.66,424.28,12a504.29,504.29,0,0,0-168.8,61.89l1.12,185.81,3,507.54v0l169.27-1-3.05-507.57Z"
          transform="translate(-4.57 -4.74)"
          fill="white"
        />
        <path
          d="M764.35,256.88l-169.16,1h-.1l3,507.57h.1l1.48,246.68-1.77.29v0a504,504,0,0,0,170.56-62.22L767.4,764.46Z"
          transform="translate(-4.57 -4.74)"
          fill="white"
        />
        <path
          d="M426.06,257l3.06,509.6,169-1L595.1,256Z"
          transform="translate(-4.57 -4.74)"
          fill="gold"
          fillRule="evenodd"
        />
        <path
          d="M598.25,765.56l-338.4,2v0L256.8,260,255.69,74.2C104.54,162.87,3.45,327.48,4.57,515.29c1.69,280.32,230.3,506.21,510.55,504.53a510.26,510.26,0,0,0,84.61-7.58Z"
          transform="translate(-4.57 -4.74)"
          fill="#16697a"
          fillRule="evenodd"
        />
        <path
          d="M509,4.75a510.59,510.59,0,0,0-84.54,7.56L426,259l169.24-1,169.16-1,3,507.57,1.11,185.8c151.17-88.67,252.24-253.29,251.12-441.15C1018,229,789.35,3.07,509,4.75Z"
          transform="translate(-4.57 -4.74)"
          fill="#16697a"
          fillRule="evenodd"
        />
      </svg>
    </Box>
  )
}
