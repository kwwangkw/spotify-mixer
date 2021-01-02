import React, { useEffect } from "react"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import axios from "axios"
import firebaseInst from "../firebase"
import { setUserTokens } from "../utils/auth"
import { profileURI } from "../utils/constants"

export default function AuthPage({ location }) {
    console.log("in TMP REDIRECT AUTH PAGE")
    const { code } = queryString.parse(location.search);
    
    useEffect(() => {
        async function getFirebaseToken() {
            const spotifyID = await axios.get(profileURI).then(res => res.data.id)
            try {
                const res = await axios.post(`${process.env.SERVER_URI}/token`, {spotifyID: spotifyID})
                return firebaseInst.auth().signInWithCustomToken(res.data.firebaseToken)
            } catch(err) {
                console.log(err)
            }
        }
        async function loginWithSpotify() {
            const res = await axios.post(`${process.env.SERVER_URI}/spotify/token`, { code: code })
            const [ accessToken, refreshToken, expiresIn ] = [ res.data.access_token, res.data.refresh_token, res.data.expires_in ]
            axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
            const user = await getFirebaseToken()
            return setUserTokens(user.user.uid, accessToken, refreshToken, expiresIn)
        }
        loginWithSpotify().then(() => navigate('/app/home'))
    }, [code])
    return null
}