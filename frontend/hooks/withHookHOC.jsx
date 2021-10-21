import { Component } from "react"
import useAuth from "./useAuth"

const withHookHOC = (props) => {
  return (props) => {
    const { identity } = useAuth()
    return <Component id={identity} />
  }
}

export { withHookHOC }
