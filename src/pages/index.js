import React from "react"
import LoadingScreen from "../components/LoadingScreen"
import SEO from "../components/SEO"
import { projectTitle } from "../utils/constants";
// markup
const IndexPage = () => {
  return (
    <div className="bg-dark-gray">
      <LoadingScreen />
      <SEO title={projectTitle} />
    </div>
  )
}

export default IndexPage
