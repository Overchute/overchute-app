import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
// import { useAuthClient } from "../../hooks/useAuthClient"

function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth()
  // let isLoggedIn = false
  console.log("auth guard", isLoggedIn)
  return (
    <>
      {isLoggedIn && <>{children}</>}
      {!isLoggedIn && <Navigate to="/signin" />}
    </>
  )
}

export default AuthGuard
