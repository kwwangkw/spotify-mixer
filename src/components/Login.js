import React, { useEffect, useState } from "react"
import cryptoRandomString from "crypto-random-string"
import { generateCodeChallenge } from "../utils/auth"
import { accountsAuthorizeURI } from "../utils/constants"
import { codeVerifier } from "../utils/constants"

export default function Login() {
    const [code_challenge, set_code_challenge] = useState("");
    useEffect(() => {
        generateCodeChallenge(codeVerifier)
        .then(code_challenge => set_code_challenge(code_challenge))
    }, [])
    return (
        <div>
            <a href={
                `${accountsAuthorizeURI}`+
                `?response_type=code`+ 
                `&client_id=${process.env.CLIENT_ID}`+
                `&redirect_uri=${process.env.REDIRECT_URI}`+
                `&scope=user-top-read playlist-modify-public playlist-modify-private`+
                `&state=${cryptoRandomString({length: 10})}`+
                `&code_challenge=${code_challenge}`+
                `&code_challenge_method=S256`
            }>Login to Spotify</a>
        </div>
    )
}