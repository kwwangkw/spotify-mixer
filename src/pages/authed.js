import React, { useState, useEffect } from "react"
import * as queryString from "query-string"
import qs from "querystring"
import axios from "axios"
import  { codeVerifier } from "./index"
import { accountsApiTokenURI } from "../utils/constants"

export default function AuthPage({ location }) {
    const { code } = queryString.parse(location.search);
    const [token, setToken] = useState("");
    const [artists, setArtists] = useState("")
    const [tracks, setTracks] = useState("")
    useEffect(() => {
        const requestBody = {
            client_id: process.env.CLIENT_ID,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: process.env.REDIRECT_URI,
            code_verifier: codeVerifier
        }
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        axios.post(accountsApiTokenURI, qs.stringify(requestBody), config)
             .then(res => { 
                 setToken(res.data.access_token) 
                 axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.access_token}`}
                 axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data.items[0].name));
                 axios.get("https://api.spotify.com/v1/me/top/tracks").then(res => setTracks(res.data.items[0].name));
                })
             .catch(error => console.log(error.response))
    }, [])
    return (
        <div>yooo, our token is {token}, your top artist is {artists}, your top track is {tracks}</div>
    )
}