import React, { useState, useEffect } from "react"
import axios from "axios"
import { getUserGroups } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { Link } from "gatsby"

export default function Home({ user }) {
    const [artists, setArtists] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        if (!user) {
            return
        }
        function getFavArtist() {
            axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data));
        }
        getUserGroups(user.uid).then(val => {
            setGroups(val)
        })
        safeAPI(user.uid, getFavArtist)
    }, [])
    return (
        <div>
            {console.log(artists)}
            {console.log(artists.items[0].name)}
            
            <div>Your fav artist: {artists.items[0].name}</div>
            <div>Artist Spotify Ranking: {artists.items[0].popularity}</div>
            <img width="200px" height="200px" src={artists.items[0].images[0]['url']} alt={artists.items[0].name}></img>

            <div>
                <p>Groups:</p>
                {groups.map(group => <div key={group.id}><Link to={`/app/group/${group.id}`}>{group.name}</Link></div>)}
            </div>
            <button>
                <Link to={"/app/newg"}>
                    New Group
                </Link>
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