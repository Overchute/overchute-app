import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth()
  console.log("auth guard", isAuthenticated)
  return (
    <>
      {isAuthenticated && <>{children}</>}
      {!isAuthenticated && <Navigate to="/signin" />}
    </>
  )
}

export default AuthGuard
