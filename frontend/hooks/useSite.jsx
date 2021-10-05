import { useContext } from "react"
import { SiteContext } from "../context/SiteContext"

const useSite = () => useContext(SiteContext)

export default useSite
