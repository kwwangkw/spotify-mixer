import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import firebaseInst from "../firebase"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const [page, setPage] = useState(null)
  useEffect(() => {
    const unsubscribe = firebaseInst.auth().onAuthStateChanged(user => {
        if (user === null && location.pathname !== "/app/login") {
            console.log("Currently not logged in")
            navigate(`/app/login`)
            setPage(null)
            return
        }   
        console.log('SIGNED IN!')
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