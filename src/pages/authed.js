import React, { useState, useEffect } from "react"
import * as queryString from "query-string"
import qs from "querystring"
import axios from "axios"
import  { redirect_uri, codeVerifier } from "./index"

export default function AuthPage({ location }) {
    const { code } = queryString.parse(location.search);
    const [token, setToken] = useState("");
    const [artists, setArtists] = useState("")
    useEffect(() => {
        const requestBody = {
            client_id: "77a66019aa004d18a9e146886cfe6b62",
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirect_uri,
            code_verifier: codeVerifier
        }
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post("https://accounts.spotify.com/api/token", qs.stringify(requestBody), config)
             .then(res => { 
                 setToken(res.data.access_token) 
                 axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.access_token}`}
                 axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data.items[0].name));
                })
             .catch(error => console.log(error.response))
    }, [])
    return (
        <div>yooo, our token is {token}, your top artist is {artists}</div>
    )
}