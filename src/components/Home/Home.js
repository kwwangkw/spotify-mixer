import React, { useState, useEffect } from "react"
import axios from "axios"
import { getUserGroups } from "../../utils/data"
import { safeAPI } from "../../utils/auth"
import { Link } from "gatsby"
import LoadingScreen from "../LoadingScreen"

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
        safeAPI(user.uid, getTopArtists)
        safeAPI(user.uid, getTopTracks)
    }, [])

    if (!artists.length) {
        return <LoadingScreen/>
    }
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
                        <a href={artists[0] && artists[0].external_urls['spotify']} target="_blank" className="-mb-3 md:-mb-10 lg:mb-0">
                            <li className="p-5 md:p-8 bg-gradient-to-br from-primary-200 to-primary-300 h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white">
                                <img className="-ml-2 md:-ml-4 mr-4 rounded-full" width="130px" height="130px" src={artists[0].images[0]['url']} alt={artists[0].name}></img>
                                <div className="truncate w-4/5 pl-1">
                                    <h3 className="text-shadow-lg font-semibold">Your Top Artist</h3>
                                    <h3 className="md:text-4xl text-dark-gray my-1">{artists[0].name}</h3>
                                    {/* <h4 className="text-2xl text-white">Ranking: {artists[0].popularity}</h4> */}
                                </div>
                            </li>
                        </a>
                        <a href={artists[1] && artists[1].external_urls['spotify']} target="_blank" className="invisible lg:visible -mb-40 lg:mb-0">
                            <li className="p-5 md:p-8 bg-gradient-to-br from-primary-300 to-primary-400 h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white">
                                <img className="-ml-4 mr-4 rounded-full" width="130px" height="130px" src={artists[1].images[0]['url']} alt={artists[0].name}></img>
                                <div className="truncate w-4/5 pl-1">
                                    <h3 className="text-shadow-lg font-semibold">Your Runner-up Artist</h3>
                                    <h3 className="md:text-4xl text-dark-gray my-1">{artists[1].name}</h3>
                                    {/* <h4 className="text-2xl text-white">Ranking: {artists[1].popularity}</h4> */}
                                </div>
                            </li>
                        </a>
                    </ul>
                    <ul className="grid gap-4 grid-cols-1 lg:grid-cols-3 md:gap-8">
                        <a href={tracks[0] && tracks[0].external_urls['spotify']} target="_blank">
                            <li className="visible -mb-44 lg:mb-0 p-3 bg-gradient-to-br from-cyan-300 to-cyan-400 h-40 rounded-2xl flex items-center text-3xl text-white transform hover:scale-105 transition duration-400 ease-in-out">
                                {tracks[0] && <img className="ml-1 mr-4 rounded" width="130px" height="130px" src={tracks[0].album.images[1]['url']} alt={tracks[0].name}></img>}
                                {tracks[0] && (
                                    <div className="truncate md:w-4/5">
                                        <h3 className="text-shadow-lg font-semibold pt-3">#1 Song</h3>
                                        <h3 className="md:text-4xl text-dark-gray my-1">{tracks[0].name}</h3>
                                        <div className="flex flex-row">
                                            {tracks[0] && tracks[0].artists.map((artist, index) => (
                                                <h3 key={index} className="text-xl text-white text-shadow-lg font-medium pb-3">{artist.name}{(index + 1 === tracks[0].artists.length) ? "" : (<span>&thinsp; &#183; &thinsp;</span>)} </h3>
                                            ))}
                                        </div> 
                                    </div>
                                )}
                            </li>
                        </a>
                        <a href={tracks[1] && tracks[1].external_urls['spotify']} target="_blank">
                            <li className="invisible lg:visible p-3 bg-gradient-to-br from-cyan-400 to-cyan-500 h-40 rounded-2xl flex items-center text-3xl text-white transform hover:scale-105 transition duration-400 ease-in-out">
                                {tracks[1] && <img className="ml-1 mr-4 rounded" width="130px" height="130px" src={tracks[1].album.images[1]['url']} alt={tracks[1].name}></img>}
                                {tracks[1] && (
                                    <div className="truncate w-4/5">
                                        <h3 className="text-shadow-lg font-semibold pt-3">#2 Song</h3>
                                        <h3 className="md:text-4xl text-dark-gray my-1">{tracks[1].name}</h3>
                                        <div className="flex flex-row">
                                            {tracks[1] && tracks[1].artists.map((artist, index) => (
                                                <h3 key={index} className="text-xl text-white text-shadow-lg font-medium pb-3">{artist.name}{(index + 1 === tracks[1].artists.length) ? "" : (<span>&thinsp; &#183; &thinsp;</span>)} </h3>
                                            ))}
                                        </div> 
                                    </div>
                                )}
                            </li>
                        </a>
                        <a href={tracks[2] && tracks[2].external_urls['spotify']} target="_blank">
                        <li className="invisible lg:visible p-3 bg-gradient-to-br from-cyan-500 to-cyan-400 h-40 rounded-2xl flex items-center text-3xl text-white transform hover:scale-105 transition duration-400 ease-in-out">
                            {tracks[2] && <img className="ml-1 mr-4 rounded" width="130px" height="130px" src={tracks[2].album.images[1]['url']} alt={tracks[2].name}></img>}
                            {tracks[2] && (
                                <div className="truncate w-4/5">
                                    <h3 className="text-shadow-lg font-semibold pt-3">#3 Song</h3>
                                    <h3 className="md:text-4xl text-dark-gray my-1">{tracks[2].name}</h3>
                                    <div className="w-56 md:w-96 lg:w-72">
                                        <p className="flex flex-row">
                                            {tracks[2] && tracks[2].artists.map((artist, index) => (
                                                <span key={index} className="text-xl text-white text-shadow-lg font-medium pb-3">{artist.name}{(index + 1 === tracks[2].artists.length) ? "" : (<span>&thinsp; &#183; &thinsp;</span>)} </span>
                                            ))}
                                        </p>
                                    </div> 
                                </div>
                            )}
                        </li>
                        </a>
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