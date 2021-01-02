import React from "react"
import cryptoRandomString from "crypto-random-string"
import { accountsAuthorizeURI } from "../utils/constants"

export default function Login() {
    return (
        <div>
            <a href={
                `${accountsAuthorizeURI}`+
                `?response_type=code`+ 
                `&client_id=${process.env.CLIENT_ID}`+
                `&redirect_uri=${process.env.REDIRECT_URI}`+
                `&scope=user-top-read playlist-modify-public playlist-modify-private`+
                `&state=${cryptoRandomString({length: 10})}`
            }>Login to Spotify</a>
        </div>
    )
}