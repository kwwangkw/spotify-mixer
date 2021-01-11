import React from "react"
import LoadingScreen from "../components/LoadingScreen"
import SEO from "../components/seo"
import { projectTitle } from "../utils/constants";
// markup
const IndexPage = () => {
  return (
    <div>
      <LoadingScreen />
      <SEO title={projectTitle} />
    </div>
  )
}

export default IndexPage
