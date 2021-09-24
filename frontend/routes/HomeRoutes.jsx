import React, { lazy } from "react"
import { Navigate } from "react-router-dom"
import HomeLayout from "../layouts/HomeLayout"

// ----------------------------------------------------------------------

const HomeRoutes = {
  path: "*",
  layout: HomeLayout,
  routes: [
    {
      exact: true,
      path: "/",
      component: lazy(() => import("../views/HomePageView")),
    },
    {
      exact: true,
      path: "/loading",
      component: lazy(() => import("../views/LoadingPageView")),
    },
    {
      component: () => <Navigate to="/404" />,
    },
  ],
}

export default HomeRoutes
