import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

function AuthGuard({ children }) {
  const { state } = useContext(AuthContext)
  console.log("auth", state)
  return (
    <>
      {state.isAuthenticated && <>{children}</>}
      {!state.isAuthenticated && <Navigate to="/signin" />}
    </>
  )
}

export default AuthGuard
