import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { setAxiosTokenHeader } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"
import { createAndFillPlaylist, getPlaylist, joinGroup, checkIsInGroup, getGroup } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { navigate, useScrollRestoration } from "gatsby"

export default function Group({ user, groupId }) {
    const [token, setToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [expireTime, setExpireTime] = useState(0)
    const [isInGroup, setIsInGroup] = useState(null)
    const [groupName, setGroupName] = useState("")
    const [playlistLink, setPlaylistLink] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const [nullMessage, setNullMessage] = useState("Loading...")

    useEffect(() => {
        async function func() {
            if (!user) {
                return
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
            })

            checkIsInGroup(user, groupId).then(val => {
                if (val !== null) {
                    setIsInGroup(val)
                }
                else {
                    setNullMessage("Invalid groupId")
                }
            })

            const group = await getGroup(groupId)
            if (group) {
                setGroupName(group.name)
                setGroupMembers(group.users)
                if (group.playlist_id) {
                    // const playlist = await getPlaylist(user, group.playlist_id)
                    // setPlaylistLink(playlist.external_urls.spotify)
                    setPlaylistLink(`https://open.spotify.com/playlist/${group.playlist_id}`)
                }
            }
        }
        func()
    }, [])

    if (isInGroup === null) {
        return (
            <div>
                {nullMessage}
            </div>
        )
    }
    if (!isInGroup) {
        return (
            <div>
                <button
                    className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                        joinGroup(user, groupId).then(() => {
                            window.location.reload()
                        })
                    }}
                    disabled={isInGroup}
                >
                    Join Group
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                    <a href={"/app/home"}>
                        Cancel
                    </a>
                </button>
            </div>
        )
    }
    return (
        <div>
            <h2>Group Name: {groupName}</h2>
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={async () => {
                    const playlist = await createAndFillPlaylist(user, groupId, refreshToken, expireTime)
                    setPlaylistLink(playlist.external_urls.spotify)
                }}
                disabled={refreshToken === "" || expireTime === 0}
            >
                Generate Playlist
            </button>
            <div>
                Playlist Link: {playlistLink}
            </div>
            <div>
                Share link: {window.location.href}
            </div>
            <div>
                <p>Group Members:</p>
                {groupMembers.map(member => <p key={member}>{member}</p>)}
            </div>
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            >
                <a href={"/app/home"}>
                    Cancel
                </a>
            </button>
        </div>
    )
}