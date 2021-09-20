import NProgress from "nprogress"
import React, { Suspense, Fragment, useEffect, lazy } from "react"
import { Switch, Route } from "react-router-dom"
import AppRoutes from "./AppRoutes"
import HomeRoutes from "./HomeRoutes"
import LoadingScreen from "../components/LoadingScreen"
import Box from "@mui/material/Box"
import { makeStyles } from "@mui/styles"

const nprogressStyle = makeStyles((theme) => ({
  "@global": {
    "#nprogress": {
      pointerEvents: "none",
      "& .bar": {
        top: 0,
        left: 0,
        height: 2,
        width: "100%",
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
        backgroundColor: theme.palette.primary.main,
        boxShadow: `0 0 2px ${theme.palette.primary.main}`,
      },
      "& .peg": {
        right: 0,
        opacity: 1,
        width: 100,
        height: "100%",
        display: "block",
        position: "absolute",
        transform: "rotate(3deg) translate(0px, -4px)",
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
      },
    },
  },
}))

function RouteProgress(props) {
  nprogressStyle()

  NProgress.configure({
    speed: 500,
    showSpinner: false,
  })

  useEffect(() => {
    NProgress.done()
    return () => {
      NProgress.start()
    }
  }, [])

  return <Route {...props} />
}
// function LoadingScreen() {
//   return <p>Loading Screen</p>
// }
export function renderRoutes(routes = []) {
  return (
    <Suspense
      fallback={
        <Box height="70vh">
          <LoadingScreen />
        </Box>
      }
    >
      <Switch>
        {routes.map((route, i) => {
          const Component = route.component
          const Guard = route.guard || Fragment
          const Layout = route.layout || Fragment

          return (
            <RouteProgress
              key={i}
              path={route.path}
              exact={route.exact}
              render={(props) => (
                <Guard>
                  <Layout>
                    {route.routes ? (
                      renderRoutes(route.routes)
                    ) : (
                      <Component {...props} />
                    )}
                  </Layout>
                </Guard>
              )}
            />
          )
        })}
      </Switch>
    </Suspense>
  )
}

const routes = [
  {
    exact: true,
    path: "/404",
    component: lazy(() => import("../views/Page404View")),
  },
  AppRoutes,
  HomeRoutes,
]

export default routes
