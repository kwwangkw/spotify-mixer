import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { setAxiosTokenHeader } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"
import { createAndFillPlaylist, joinGroup, checkIsInGroup, getUserGroups } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { useScrollRestoration } from "gatsby"

export default function Home({ user }) {
    const groupId = "IYMcWpozvPVtGglzUwwN"

    const [token, setToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [expireTime, setExpireTime] = useState(0)
    const [artists, setArtists] = useState("")
    const [isInGroup, setIsInGroup] = useState(true)
    const [playlistLink, setPlaylistLink] = useState("")
    const [groups, setGroups] = useState([])

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
                setAxiosTokenHeader(data.curr_token)
                setToken(data.curr_token)
                setRefreshToken(data.refresh_token)
                setExpireTime(data.expire_time)
                return data
            } else {
                console.log("user does not exist")
            }
        }).then((data) => safeAPI(user.uid, getFavArtist))

        // checkIsInGroup(user, groupId).then(val => {
        //     setIsInGroup(val)
        // })

        getUserGroups(user.uid).then(val => {
            setGroups(val)
        })
    }, [])

    return (
        <div>
            <div>Your tokens are {token}, {refreshToken}. Artist: {artists}</div>
            <div>
                <p>Groups:</p>
                {groups.map(group => <a key={group.id} href={`${process.env.BASE_URI}/app/group/${group.id}`}>{group.name}</a>)}
            </div>
            {/* <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                    const playlist = await createAndFillPlaylist(user, groupId, refreshToken, expireTime)
                    setPlaylistLink(playlist.external_urls.spotify)
                }}
                disabled={refreshToken === "" || expireTime === 0}
            >
                Generate Playlist
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={() => joinGroup(user, groupId)}
                disabled={isInGroup}
            >
                Join Group
            </button>
            <div>
                {playlistLink}
            </div> */}
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={signOut}
            >
                Log Out
            </button>
        </div>
    )
}