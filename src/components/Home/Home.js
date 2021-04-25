import React, { useState, useEffect } from "react"
import axios from "axios"
import firebase from "gatsby-plugin-firebase"
import { getUserGroups } from "../../utils/data"
import { safeAPI } from "../../utils/auth"
import { Link } from "gatsby"
import ArtistCard from "./ArtistCard"
import SongCard from "./SongCard"

export default function Home({ user }) {
    const [artists, setArtists] = useState([])
    const [tracks, setTracks] = useState([])
    const [groups, setGroups] = useState([])

    useEffect(() => {
        firebase.analytics().logEvent("Home Screen View")
    }, [])

    useEffect(() => {
        if (!user) {
            return
        }
        function getTopArtists() {
            axios.get("https://api.spotify.com/v1/me/top/artists").then(res => setArtists(res.data.items));
        }
        function getTopTracks() {
            axios.get("https://api.spotify.com/v1/me/top/tracks").then(res => setTracks(res.data.items));
        }
        getUserGroups(user.uid).then(val => {
            setGroups(val)
        })
        safeAPI(user.uid, getTopArtists)
        safeAPI(user.uid, getTopTracks)
    }, [])

    return (
        <>
            <div className="px-8 md:px-10 lg:px-16">
            <div className="flex flex-col justify-center text-center pt-16">
                <h1 className="text-primary-400 text-4xl mb-2">Welcome {user.display_name},</h1>
                <h1 className="text-gray-400 text-5xl mb-16">Let's discover some music!</h1>
            </div>
            
            <div id="insights">
                <h1 className="text-white text-4xl mb-3 text-center md:text-left">Personal Insights</h1>
                <ul className="grid gap-4 grid-cols-1 md:gap-8">
                    <ul className="grid gap-4 grid-cols-1 lg:grid-cols-2 md:gap-8">
                        <ArtistCard artist={artists[0]} insertClassnames="from-primary-200 to-primary-300" title="Your Top Artist" insertClassnamesA="" />
                        <ArtistCard artist={artists[1]} insertClassnames="from-primary-300 to-primary-400" insertClassnamesA="invisible lg:visible -mb-40 md:-mb-64 lg:mb-0" title="Your Runner Up Artist" />
                    </ul>
                    <ul className="grid gap-4 grid-cols-1 lg:grid-cols-3 md:gap-8">
                        <SongCard track={tracks[0]} rank={1} insertClassnames="-mb-44 lg:mb-0 from-cyan-300 to-cyan-400" />
                        <SongCard track={tracks[1]} rank={2} insertClassnames="from-cyan-400 to-cyan-500 invisible lg:visible" />
                        <SongCard track={tracks[2]} rank={3} insertClassnames="from-cyan-500 to-cyan-400 invisible lg:visible"/>
                    </ul>
                </ul>
            </div>

            <div id="groups" className="py-16 -mt-40 lg:mt-0">
                <h1 className="text-white text-4xl mb-3 text-center md:text-left">Your Groups</h1>
                <ul className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:gap-8">
                    {groups.map(group => 
                        <div key={group.id}>
                            <Link to={`/app/group/${group.id}`}>
                                <li className="break-words overflow-hidden p-4 bg-gradient-to-br from-gray-600 to-gray-700 h-40 text-gray-200 transform hover:scale-105 transition duration-400 ease-in-out rounded-xl flex justify-center items-center text-center text-3xl font-light">
                                    <div className="flex flex-col">
                                        <h2>{group.name}</h2>
                                    </div>
                                </li>
                            </Link>
                        </div>
                    )}
                    <Link to={"/app/newg"}>
                        <li className="p-2 bg-gradient-to-br from-primary-200 to-primary-500 transform hover:scale-105 transition duration-400 ease-in-out h-40 rounded-xl flex justify-center items-center text-center text-7xl text-white">
                            +
                        </li>
                    </Link>
                </ul>
            </div>
            </div>
        </>
    )
}