import React, { useEffect } from "react"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import { loginWithSpotify } from "../utils/auth"

export default function AuthPage({ location }) {
    const { code } = queryString.parse(location.search);    
    useEffect(() => {
        loginWithSpotify(code, false).then(() => {
            navigate('/app/home')
        })
    }, [code])
    return null
}
