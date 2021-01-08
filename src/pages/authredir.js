import React, { useEffect } from "react"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { loginWithSpotify } from "../utils/auth"

export default function AuthPageRedir({ location }) {
    const { code } = queryString.parse(location.search);
    const redirectTo = sessionStorage.getItem("redirectTo")
    sessionStorage.removeItem("redirectTo")
    
    useEffect(() => {
        loginWithSpotify(code, true).then(() => {
            navigate(redirectTo)
        })
    }, [code])
    return null
}
