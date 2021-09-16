import React from "react"
// material
import { useTheme } from "@material-ui/core/styles"
import { Box } from "@material-ui/core"

// ----------------------------------------------------------------------

export default function Logo({ sx }) {
  const theme = useTheme()
  //   const PRIMARY_LIGHT = theme.palette.primary.light
  //   const PRIMARY_MAIN = theme.palette.primary.main
  //   const PRIMARY_DARK = theme.palette.primary.dark

  return (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 961.04 961.04">
        <path
          d="M431.91,270.68V753.15H592V270.68Z"
          transform="translate(-31.48 -31.48)"
          fill="gold"
          fillRule="evenodd"
        />
        <path
          d="M592.11,752.28H271.72V95.79C128.12,178.88,31.48,334.15,31.48,512c0,265.39,215.16,480.55,480.49,480.55a484.28,484.28,0,0,0,80.14-6.69Z"
          transform="translate(-31.48 -31.48)"
          fill="#16697a"
          fillRule="evenodd"
        />
        <path
          d="M512,31.48a483.55,483.55,0,0,0-80.08,6.68V271.72H752.28V928.19C895.89,845.1,992.52,689.82,992.52,512,992.52,246.64,777.36,31.48,512,31.48Z"
          transform="translate(-31.48 -31.48)"
          fill="#16697a"
          fillRule="evenodd"
        />
      </svg>
    </Box>
  )
}
