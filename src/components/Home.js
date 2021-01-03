import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { usersCollection } from "../utils/constants"
import { createAndFillPlaylist } from "../utils/data"
import { safeAPI } from "../utils/auth"
import { useScrollRestoration } from "gatsby"

export default function Home({ user }) {
    const [token, setToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [expireTime, setExpireTime] = useState(0)
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
                setExpireTime(data.expire_time)
                return data
            } else {
                console.log("user does not exist")
            }
        }).then((data) => safeAPI(user.uid, getFavArtist, data.refresh_token, data.expire_time))
    }, [])

    return (
        <div>
            <div>Your tokens are {token}, {refreshToken}. Artist: {artists}</div>
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                    createAndFillPlaylist(user, "IYMcWpozvPVtGglzUwwN", refreshToken, expireTime)
                }}
                disabled={refreshToken === "" || expireTime === 0}
            >
                Generate Playlist
            </button>
        </div>
    )
}