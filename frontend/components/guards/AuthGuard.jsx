import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

function AuthGuard({ children }) {
  const { isAuthenticated } = useAuth
  console.log("auth", isAuthenticated)
  return (
    <>
      {state.isAuthenticated && <>{children}</>}
      {!state.isAuthenticated && <Navigate to="/signin" />}
    </>
  )
}

export default AuthGuard
