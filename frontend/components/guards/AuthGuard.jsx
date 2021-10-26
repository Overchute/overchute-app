import React from "react"
import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

function AuthGuard({ children }) {
  const { isLoggedIn } = useAuth()
  // console.log("auth guard", isLoggedIn)
  return (
    <>
      {isLoggedIn && <>{children}</>}
      {!isLoggedIn && <Navigate to="/signin" />}
    </>
  )
}

export default AuthGuard
