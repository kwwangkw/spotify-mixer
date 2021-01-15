import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import firebase from "gatsby-plugin-firebase"
import { getUser } from "../../utils/data"
import { projectTitle } from "../../utils/constants";
import SEO from "../SEO";
import Navbar from "../Navbar";

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const [page, setPage] = useState(null)
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async user => {
        if (typeof window === "undefined") {
          return
        }
        const locationPath = location.pathname
        if (user === null && locationPath !== "/app/login") {
            if (/^\/app\/group\//.test(locationPath)) {
              navigate("/app/login", {
                state: { redirectTo: true }
              })
              sessionStorage.setItem("redirectTo", locationPath)
            } else {
              navigate("/app/login")
            }
            setPage(null)
            return
        }
        const spotifyUser = await getUser(user.uid)
        user = {...user, ...spotifyUser}
        setPage(
          <div className="bg-dark-gray text-primary-400 w-full min-h-screen font-sans">
            <SEO title={projectTitle} />
            <Navbar user={user} />
            <Component {...rest} user={user} />
          </div>
        )
    })
    return unsubscribe
  }, [])
  return page
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute