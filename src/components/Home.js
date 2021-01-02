import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { usersCollection } from "../utils/constants"
import { safeAPI } from "../utils/auth"

export default function Home({ user }) {
    const [token, setToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [artists, setArtists] = useState("")
    useEffect(() => {
        if (!user) {
            return
        }
        function getFavArtist() {
            axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data.items[0].name));
        }
        const db = firebaseInst.firestore()
        db.collection(usersCollection).doc(user.uid).get().then(doc => {
            if (doc.exists) {
                const data = doc.data()
                axios.defaults.headers.common = {'Authorization': `Bearer ${data.curr_token}`}
                setToken(data.curr_token)
                setRefreshToken(data.refresh_token)
                return data
            } else {
                console.log("user does not exist")
            }
        }).then((data) => safeAPI(user, getFavArtist, data.refresh_token, data.expire_time))
    }, [])

    return (
        <div>Your tokens are {token}, {refreshToken}. Artist: {artists}</div>
    )
}