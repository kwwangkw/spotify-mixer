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
        <div className="bg-dark-gray text-white w-full h-screen font-sans min-h-screen">
            <div class="h-1/2 flex flex-col lg:flex-row mx-auto mb-20 justify-center items-center pt-10">
                <div className="w-2/3 flex flex-col m-3 h-full">
                    <div className="flex flex-row items-center justify-between h-1/2">
                        <div className="h-full w-1/3 bg-light-gray m-3 rounded p-2 text-white font-light flex justify-center items-center text-5xl text-center">{user.uid}'s Dashboard</div>
                        <div className="h-full w-1/3 bg-light-gray m-3 rounded p-2 text-primary-400 font-medium flex justify-center items-center text-4xl text-center">Personal Insights</div>
                        <div className="h-full w-1/3 bg-light-gray m-3 rounded p-2 text-primary-400 font-thin flex justify-center items-center text-4xl text-center">2021</div>
                    </div>
                    <div className="h-1/2 mt-3 mx-3 bg-light-gray flex flex-col items-center justify-center rounded p-2">
                        <img width="100px" height="100px" src={artists.items[0].images[0]['url']} alt={artists.items[0].name}></img>
                        <div>Your fav artist: {artists.items[0].name}</div>
                        <div>Artist Spotify Ranking: {artists.items[0].popularity}</div>
                    </div>
                </div>
                <div className="h-full bg-light-gray w-1/3 rounded m-3 p-2">Hullo</div>
            </div>
            {console.log(artists)}
            {console.log(artists.items[0].name)}
            
            

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