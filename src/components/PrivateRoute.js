import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import firebaseInst from "../firebase"
import { getUser } from "../utils/data"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const [page, setPage] = useState(null)
  useEffect(() => {
    const unsubscribe = firebaseInst.auth().onAuthStateChanged(async user => {
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
        console.log("SIGNED IN!")
        console.log(user)
        setPage(<Component {...rest} user={user} />)
    })
    return unsubscribe
  }, [])
  return page
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute