import React, { Suspense, lazy } from "react"
import { Navigate, useRoutes, useLocation } from "react-router-dom"
import HomeLayout from "../layouts/HomeLayout"
import NotFoundLayout from "../layouts/NotFoundLayout"
import LoadingScreen from "../components/LoadingScreen"
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation()
  const isDashboard = pathname.includes("/dashboard")

  return (
    <Suspense
      fallback={
        <LoadingScreen
        // sx={{
        //   ...(!isDashboard && {
        //     top: 0,
        //     left: 0,
        //     width: 1,
        //     zIndex: 9999,
        //     position: "fixed",
        //   }),
        // }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  )
}

export default function Router() {
  return useRoutes([
    // Crowdsales Routes
    {
      path: "crowdsale",
      element: <HomeLayout />,
      children: [
        { element: <Navigate to="/crowdsale" replace /> },
        { path: "contribute/:id", element: <Contribute /> },
        { path: "create", element: <Create /> },
        { path: "delete/:id", element: <Delete /> },
        { path: "list", element: <List /> },
        { path: "search", element: <Search /> },
        { path: "show/:id", element: <Show /> },
        // {
        //   path: "app",
        //   children: [
        //     { element: <Navigate to="/dashboard/app/four" replace /> },
        //     { path: "four", element: <PageFour /> },
        //     { path: "five", element: <PageFive /> },
        //     { path: "six", element: <PageSix /> },
        //   ],
        // },
      ],
    },

    // Main Routes
    {
      path: "*",
      element: <NotFoundLayout />,
      children: [
        { path: "404", element: <NotFound /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: "/",
      element: <HomeLayout />,
      children: [{ element: <HomePage /> }],
    },
    {
      path: "/loading",
      element: <HomeLayout />,
      children: [{ element: <LoadingPage /> }],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ])
}

// IMPORT COMPONENTS

// Crowdsale
const Contribute = Loadable(lazy(() => import("../views/ContributePageView")))
const Create = Loadable(lazy(() => import("../views/CreatePageView")))
const Delete = Loadable(lazy(() => import("../views/DeletePageView")))
const List = Loadable(lazy(() => import("../views/ListPageView")))
const Search = Loadable(lazy(() => import("../views/SearchPageView")))
const Show = Loadable(lazy(() => import("../views/ShowPageView")))
const NotFound = Loadable(lazy(() => import("../views/Page404View")))
// Main
const HomePage = Loadable(lazy(() => import("../views/HomePageView")))
const LoadingPage = Loadable(lazy(() => import("../views/LoadingPageView")))
