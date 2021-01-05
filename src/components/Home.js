import React, { useState, useEffect } from "react"
import axios from "axios"
import { getUserGroups } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"

export default function Home({ user }) {
    const [artists, setArtists] = useState("")
    const [groups, setGroups] = useState([])

    useEffect(() => {
        if (!user) {
            return
        }
        function getFavArtist() {
            axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data.items[0].name));
        }
        getUserGroups(user.uid).then(val => {
            setGroups(val)
        })
        safeAPI(user.uid, getFavArtist)
    }, [])
    return (
        <div>
            <div>Your fav artist: {artists}</div>
            <div>
                <p>Groups:</p>
                {groups.map(group => <div><a key={group.id} href={`${process.env.BASE_URI}/app/group/${group.id}`}>{group.name}</a></div>)}
            </div>
            <button>
                <a href="/app/newg">
                    New Group
                </a>
            </button>
            <br/>
            <button
                className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                onClick={signOut}
            >
                Log Out
            </button>
        </div>
    )
}