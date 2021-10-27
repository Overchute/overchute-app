import React, { Suspense, lazy } from "react"
import { Navigate, useRoutes, useLocation } from "react-router-dom"
import AuthGuard from "../components/guards/AuthGuard"
import HomeLayout from "../layouts/HomeLayout"
import NotFoundLayout from "../layouts/NotFoundLayout"
import LoadingScreen from "../components/LoadingScreen"
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation()
  const isDashboard = pathname.includes("/dashboard")

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  )
}

export default function Router() {
  return useRoutes([
    // Crowdsales Routes - Protected
    {
      path: "crowdsale",
      element: (
        <AuthGuard>
          <HomeLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/crowdsale" replace /> },
        { path: "contribute/:id", element: <Contribute /> },
        { path: "create", element: <Create /> },
        { path: "delete/:id", element: <Delete /> },
        { path: "edit/:id/:offer/:deadline", element: <Edit /> },
        { path: "my", element: <My /> },
      ],
    },

    // Guest Routes - Unprotected
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
      path: "/list",
      element: <HomeLayout />,
      children: [{ element: <List /> }],
    },
    {
      path: "/search",
      element: <HomeLayout />,
      children: [{ element: <Search /> }],
    },
    {
      path: "show/:id",
      element: <HomeLayout />,
      children: [{ element: <Show /> }],
    },
    {
      path: "/signin",
      element: <HomeLayout />,
      children: [{ element: <Signin /> }],
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

// Crowdsale - protected
const Contribute = Loadable(lazy(() => import("../views/ContributePageView")))
const Create = Loadable(lazy(() => import("../views/CreatePageView")))
const Delete = Loadable(lazy(() => import("../views/DeletePageView")))
const Edit = Loadable(lazy(() => import("../views/EditPageView")))
const Show = Loadable(lazy(() => import("../views/ShowPageView")))
const My = Loadable(lazy(() => import("../views/MyCrowdsalesPageView")))

// Guest - unprotected
const HomePage = Loadable(lazy(() => import("../views/HomePageView")))
const LoadingPage = Loadable(lazy(() => import("../views/LoadingPageView")))
const List = Loadable(lazy(() => import("../views/ListPageView")))
const Search = Loadable(lazy(() => import("../views/SearchPageView")))
const Signin = Loadable(lazy(() => import("../views//SigninPageView")))
const NotFound = Loadable(lazy(() => import("../views/Page404View")))
