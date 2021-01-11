import React, { useEffect } from "react"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { loginWithSpotify } from "../utils/auth"

export default function AuthPageRedir({ location }) {
    const { code } = queryString.parse(location.search);
    
    useEffect(() => {
        if (typeof window !== "undefined") {
            const redirectTo = sessionStorage.getItem("redirectTo")
            sessionStorage.removeItem("redirectTo")
            loginWithSpotify(code, true).then(() => {
                navigate(redirectTo)
            })
        }
    }, [code])
    return null
}
