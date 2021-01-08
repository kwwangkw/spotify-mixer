import React, { useState, useEffect } from "react"
import axios from "axios"
import { getUserGroups } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { Link } from "gatsby"

export default function Home({ user }) {
    const [artists, setArtists] = useState([])
    const [tracks, setTracks] = useState([])
    const [groups, setGroups] = useState([])

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
        safeAPI(user.uid, getTopArtists, getTopTracks)
    }, [])

    if (!artists.length) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <div className="bg-dark-gray text-primary-400 w-full min-h-screen font-sans px-5 md:px-10 lg:px-16">
            {console.log(artists)}
            {console.log(tracks)}
            <div className="flex flex-col justify-center text-center pt-16">
                <h1 className="text-primary-400 text-4xl mb-2">Welcome {user.uid},</h1>
                <h1 className="text-gray-400 text-5xl mb-16">Let's discover some music!</h1>
            </div>
            
            <div id="insights">
                <h1 className="text-white text-4xl mb-3 text-center md:text-left">Personal Insights</h1>
                <ul className="grid gap-4 grid-cols-1 md:gap-8">
                    <ul className="grid gap-4 grid-cols-1 lg:grid-cols-2 md:gap-8">
                        <a href={artists[0].external_urls['spotify']} target="_blank">
                            <li className="p-5 md:p-8 bg-gradient-to-br from-red-200 to-red-400 h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white">
                                <img className="mr-4 rounded-full" width="130px" height="130px" src={artists[0].images[0]['url']} alt={artists[0].name}></img>
                                <div>
                                    <h3 >Your Top Artist</h3>
                                    <h3 className="md:text-4xl text-dark-gray my-1">{artists[0].name}</h3>
                                    <h4 className="text-2xl text-white">Ranking: {artists[0].popularity}</h4>
                                </div>
                            </li>
                        </a>
                        <a href={artists[0].external_urls['spotify']} target="_blank">
                            <li className="p-5 md:p-8 bg-gradient-to-br from-indigo-200 to-indigo-400 h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white">
                                <img className="mr-4 rounded-full" width="130px" height="130px" src={artists[0].images[0]['url']} alt={artists[0].name}></img>
                                <div>
                                    <h3 >Your Top Track</h3>
                                    <h3 className="text-4xl text-dark-gray my-1">{artists[0].name}</h3>
                                    <h4 className="text-2xl text-white">Ranking: {artists[0].popularity}</h4>
                                </div>
                            </li>
                        </a>
                    </ul>
                    <ul className="grid gap-4 grid-cols-2 md:grid-cols-3 md:gap-8">
                        <li className="p-3 bg-gradient-to-br from-primary-200 to-primary-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white"></li>
                        <li className="p-3 bg-gradient-to-br from-pink-200 to-pink-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white"></li>
                    <li className="p-3 bg-gradient-to-br from-yellow-200 to-yellow-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white"></li>
                    </ul>
                </ul>
            </div>

            <div id="groups" className="py-16">
                <h1 className="text-white text-4xl mb-3 text-center md:text-left">Your Groups</h1>
                <ul className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:gap-8">
                    {groups.map(group => 
                        <div key={group.id}>
                            <Link to={`/app/group/${group.id}`}>
                                <li className="overflow-hidden p-4 bg-gradient-to-br from-gray-600 to-gray-700 h-40 text-gray-300 transform hover:scale-105 transition duration-400 ease-in-out rounded-xl flex justify-center items-center text-center text-4xl font-light">
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
                    {/*
                    <li className="p-3 bg-gradient-to-br from-indigo-200 to-indigo-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white">Kevin's Test Group</li>
                    <li className="p-3 bg-gradient-to-br from-green-200 to-green-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white">Richard and Kevin's</li>
                    <li className="p-3 bg-gradient-to-br from-blue-200 to-blue-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white">super long name test group yup</li>
                    <li className="p-3 bg-gradient-to-br from-red-200 to-red-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white">Update Testing</li>
                    <li className="p-3 bg-gradient-to-br from-yellow-200 to-yellow-400 h-40 rounded-2xl flex justify-center items-center text-center text-4xl text-white">Kev F's Group</li>
                    */}
                </ul>
            </div>
            

            {/*
            <div>Your fav artist: <a href={artists[0].external_urls['spotify']} target="_blank">{artists[0].name}</a></div>
            <div>Artist Spotify Ranking: {artists[0].popularity}</div>
            <img width="200px" height="200px" src={artists[0].images[0]['url']} alt={artists[0].name}></img>

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
            */}
        </div>
    )
}