import React, { useEffect } from "react"
import * as queryString from "query-string"
import { navigate } from "gatsby"
import axios from "axios"
import firebaseInst from "../firebase"
import { profileURI } from "../utils/constants"

export default function AuthPage({ location }) {
    console.log("in TMP REDIRECT AUTH PAGE")
    const { code } = queryString.parse(location.search);
    const db = firebaseInst.firestore()
    useEffect(() => {
        function setUserTokens(user, accessToken, refreshToken) {
                db.collection("users")
                    .doc(user.user.uid)
                    .set({ curr_token: accessToken, refresh_token: refreshToken,
                })
        }
        async function getFirebaseToken(accessToken, refreshToken) {
            const spotifyID = await axios.get(profileURI).then(res => res.data.id)
            try {
                const res = await axios.post(`${process.env.SERVER_URI}/token`, {spotifyID: spotifyID})
                const user = await firebaseInst.auth().signInWithCustomToken(res.data.firebaseToken)
                setUserTokens(user, accessToken, refreshToken)
            } catch(err) {
                console.log(err)
            }
        }
        async function loginWithSpotify() {
            const res = await axios.post(`${process.env.SERVER_URI}/spotify/token`, { code: code })
            const [ accessToken, refreshToken ] = [ res.data.access_token, res.data.refresh_token ]
            axios.defaults.headers.common = {'Authorization': `Bearer ${res.data.access_token}`}
            return getFirebaseToken(accessToken, refreshToken)
        }
        loginWithSpotify().then(() => navigate('/app/home'))
    }, [code])
    return null
}