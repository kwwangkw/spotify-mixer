import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { setAxiosTokenHeader } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"
import { createAndFillPlaylist, updatePlaylist, getPlaylist, joinGroup, checkIsInGroup, getGroup, getUser } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { Link, navigate, useScrollRestoration } from "gatsby"


const tooltip = {
    // color: "#232129",
    // padding: "96px",
    // fontFamily: "-apple-system, Roboto, sans-serif, serif",
}

const tooltiptext = {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: '6px',
    position: 'absolute',
    zIndex: '1',
    top: '-5px',
    left: '105%',
}

// const tooltiptext = {
//     visibility: hidden,
//     width: 120px,
//     background-color: black,
//     color: '#fff',
//     text-align: center,
//     padding: 5px 0,
//     border-radius: 6px,
    
//     /* Position the tooltip text - see examples below! */
//     position: 'absolute',
//     zIndex: '1',
// }

export default function Group({ user, groupId }) {
    const [isInGroup, setIsInGroup] = useState(null)
    const [groupName, setGroupName] = useState("")
    const [playlistID, setPlaylistID] = useState(null)
    const [playlistLink, setPlaylistLink] = useState("")
    const [playlistName, setPlaylistName] = useState("")
    const [playlistImageLink, setPlaylistImageLink] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const [isCopied, setIsCopied] = useState(false)
    const [nullMessage, setNullMessage] = useState("Loading...")
    const [playlistTracks, setPlaylistTracks] = useState([])
    const [timeoutID, setTimeoutID] = useState(null)

    // For generate playlist form
    const DEFAULT_LIMIT_PER_PERSON = 3
    const [limitPerPerson, setLimitPerPerson] = useState(DEFAULT_LIMIT_PER_PERSON)
    const DEFAULT_TIME_RANGE = "short_term"
    const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE)

    function copyToClipboard(){
        var temp = document.createElement('input'),
        text = window.location.href;

        document.body.appendChild(temp);
        temp.value = text;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    }

    function parseTracks(tracksIn){
        let tracks = []
        for(let index = 0; index < tracksIn.items.length; index++){
            let trackInfo = tracksIn.items[index].track
            let currentTrack = {
                id: trackInfo.id,
                name: trackInfo.name,
                artists: [],
                image_url: trackInfo.album.images[0].url,
                album_name: "",
                duration_min: Math.trunc(trackInfo.duration_ms/60000),
                duration_sec: Math.trunc((trackInfo.duration_ms-(Math.trunc(trackInfo.duration_ms/60000)*60000))/1000),
                song_url: trackInfo.external_urls.spotify
            }
            if (trackInfo.album.album_type === 'album') {
                currentTrack.album_name = trackInfo.album.name
            }

            for(let nArtist = 0; nArtist < trackInfo.artists.length; nArtist++){
                currentTrack.artists.push(trackInfo.artists[nArtist].name)
            }
            tracks.push(currentTrack)
        }
        setPlaylistTracks(tracks)
        console.log(tracks)
    }

    function setCopyTimeout(milliseconds) {
        if (timeoutID !== null) {
            clearTimeout(timeoutID)
        }
        const newTimeoutID = setTimeout(() => {
            setIsCopied(false)
        }, milliseconds)
        setTimeoutID(newTimeoutID)
    }

    function refreshPlaylist(playlistID) {
        getPlaylist(user, playlistID).then((data) => 
        {
            console.log(data)
            setPlaylistName(data.data.name)
            setPlaylistImageLink(data.data.images[0].url)
            parseTracks(data.data.tracks);
        }).catch(error => {
            if (error && error.response && error.response.status === 404) {
                makePlaylistEmpty()
            }
        })
    }

    function makePlaylistEmpty() {
        setPlaylistID("")
        setPlaylistLink("")
        setPlaylistImageLink("")
    }

    useEffect(() => {
        async function func() {
            if (!user) {
                return
            }

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
                let newGroupMembers = []
                for (const uid of group.users) {
                    let member = await getUser(uid)
                    member = (({id, display_name, images}) => ({id, display_name, images}))(member)
                    newGroupMembers.push(member)
                }
                console.log(newGroupMembers)
                setGroupMembers(newGroupMembers)
                if (group.playlist_id) {
                    setPlaylistID(group.playlist_id)
                    setPlaylistLink(`https://open.spotify.com/playlist/${group.playlist_id}`)
                    console.log(group.playlist_id)
                    console.log(user)
                    refreshPlaylist(group.playlist_id)
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
            <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
                <div className="w-full h-full flex flex-col justify-center text-center items-center">
                    <h1 className="text-white font-thin text-5xl mb-16">
                        You've been invited to join a Spotify Mixer group:
                    </h1>
                    <h1 className="italic text-primary-400 font-extralight text-6xl mb-16">{groupName}</h1>
                    <button
                        style={{'outline': 'none'}}
                        className="mx-auto text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
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
                        style={{'outline': 'none'}}
                        className="py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                    >
                        <Link to={"/app/home"}>
                            Decline
                        </Link>
                    </button>
                </div>
            </div>
        )
    }
    if (playlistLink === "") {
        return (
            <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
                <div className="w-full h-full flex flex-col justify-center text-center items-center">
                    <div className="flex flex-row">
                        <h1 className="text-white font-medium text-5xl mb-3">{groupName}<span></span></h1>
                        <button style={{'outline': 'none'}} className="relative group text-primary-400 mb-3 text-5xl hover:text-primary-300 transition duration-300 ease-in-out"
                                onClick={() => {
                                    copyToClipboard()
                                    setIsCopied(true)
                                    setCopyTimeout(1000)
                                }}
                        >
                                <svg 
                                    className="ml-3 h-5 w-5 text-white-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />  
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            <span className={`${ !isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin invisible ml-1 group-hover:visible `} style={{'top': '15px', 'left' : '110%', 'width': '120px'}}>Copy Invite Link</span>
                            <span className={`${ isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin ml-1 `} style={{'top': '15px', 'left' : '110%', 'width': '120px'}}>Copied!</span>
                        </button>
                    </div>
                    <div className="text-gray-400 text-lg mb-12">
                        <span> &#183; </span>{groupMembers.map(member => <span key={member.id}>{member.display_name} &#183; </span>)}
                    </div>

                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 flex flex-col items-center md:items-end justify-center md:border-r border-gray-500 text-center md:text-right md:pr-5 lg:pl-40 md:pt-10">
                            <h2 className="flex border-none -mb-3 p-5 text-primary-400 font-medium text-4xl">Ahhhh!</h2>
                            <h2 className="flex border-none -mt-3 p-5 text-gray-400 font-extralight text-4xl mb-16">You haven't created a playlist for this group yet- let's get started!</h2>
                        </div>

                        {/* FORM STUFF */}
                        <div className="flex flex-col text-white text-lg items-center md:pl-5 -mt-10 md:mt-0 pt-10 md:pt-0 md:border-none">
                            <label className="text-primary-400 text-xl font-light">Playlist Name</label>
                            <input 
                                className="text-3xl mb-8 bg-transparent text-white font-thin text-center outline-none overflow-visible border-b border-gray-500 px-0" 
                                placeholder="e.g. Raining Whales"
                                onChange={e => setPlaylistName(e.target.value)}
                            />
                            <label className="text-primary-400 text-xl font-light">Tracks per Contributor</label>
                            <div className="w-1/4">
                                <input 
                                    type="number"
                                    min="1"
                                    max="50"
                                    defaultValue = {DEFAULT_LIMIT_PER_PERSON.toString()}
                                    onChange={e => setLimitPerPerson(parseFloat(e.target.value))}
                                    className="text-2xl mb-8 bg-transparent text-white font-thin text-center outline-none overflow-visible border-b border-gray-500" 
                                />
                            </div>
                            <label className="text-primary-400 text-xl font-light">Fav Songs From...</label>
                            <div className="flex flex-row md:flex-col lg:flex-row mb-8 text-xl text-white font-thin text-center">
                                <label className="mx-3">
                                    <input type="radio" name="size" id="short_term" value="short_term" checked={timeRange === "short_term"} onChange={e => setTimeRange(e.target.value)} />
                                    <span className="mb-8 bg-transparent outline-none ml-2">Recents</span>
                                </label>
                                <label className="mx-3">
                                    <input type="radio" name="size" id="medium_term" value="medium_term" checked={timeRange === "medium_term"} onChange={e => setTimeRange(e.target.value)} />
                                    <span className="mb-8 bg-transparent outline-none ml-2">Past Half Year</span>
                                </label>
                                <label className="mx-3">
                                    <input type="radio" name="size" id="long_term" value="long_term" checked={timeRange === "long_term"} onChange={e => setTimeRange(e.target.value)} />
                                    <span className="mb-8 bg-transparent outline-none ml-2">All Time</span>
                                </label>
                            </div>

                            <button
                                style={{'outline': 'none'}}
                                className="text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                                onClick={async () => {
                                    try {
                                        const playlist = await createAndFillPlaylist(user, groupId, playlistName, timeRange, limitPerPerson)
                                        console.log(playlist)
                                        setPlaylistID(playlist.id)
                                        setPlaylistLink(playlist.external_urls.spotify)
                                        refreshPlaylist(playlist.id)
                                    } catch(e){
                                        if (e !== "invalid input") {
                                            throw e
                                        }
                                        alert("Invalid input")
                                    }
                                }}
                            >
                                Generate Playlist
                            </button>
                            <button
                                style={{'outline': 'none'}}
                                className="py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                            >
                                <Link to={"/app/home"}>
                                    Home
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-dark-gray text-primary-400 w-full min-h-screen font-sans">
            <div className="w-full h-full flex flex-col text-center items-center px-4 pt-20 mb-12 lg:mb-20">
                <div className="flex flex-row">
                    <h1 className="text-white font-medium text-5xl mb-3">{groupName}<span></span></h1>
                    <button style={{'outline': 'none'}} className="relative group text-primary-400 mb-3 text-5xl hover:text-primary-300 transition duration-300 ease-in-out"
                            onClick={() => {
                                copyToClipboard()
                                setIsCopied(true)
                                setCopyTimeout(1000)
                            }}
                    >
                            <svg 
                                className="ml-3 h-5 w-5 text-white-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />  
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                        <span className={`${ !isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin invisible ml-1 group-hover:visible `} style={{'top': '15px', 'left' : '110%', 'width': '120px'}}>Copy Invite Link</span>
                        <span className={`${ isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin ml-1 `} style={{'top': '15px', 'left' : '110%', 'width': '120px'}}>Copied!</span>
                    </button>
                </div>
                <div className="text-gray-400 text-lg mb-3">
                    <span> &#183; </span>{groupMembers.map(member => <span key={member.id}>{member.display_name} &#183; </span>)}   
                </div>
                <button
                    style={{'outline': 'none'}}
                    className="py-1 text-white font bg-gray-500 text-center font-semibold rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                >
                    <Link to={"/app/home"}>
                        Home
                    </Link>
                </button>
            </div>
            <div className="w-full h-full flex flex-col lg:flex-row pb-20 lg:pl-32">
                <div id="left" className="lg:w-1/3 text-center flex flex-col items-center mb-20 lg:mb-0 lg:mr-20">
                    <div className="group">
                        <a href={playlistLink} target="_blank">
                            <img width="300" height="300" className="relative mb-2 flex-shrink-0" src={playlistImageLink} />
                            {/* <div className="absolute z-2 bg-primary-400" style={{'width': '300', 'height': '300'}}></div> */}
                            <h2 className="mb-2 text-white font-medium font-2xl group-hover:underline">{playlistName}</h2>
                        </a>
                    </div>
                        <h2 className="mb-10 text-gray-400 font-light mx-auto">{playlistTracks.length} Tracks from {groupMembers.length} {groupMembers.length === 1 ?'Contributor' : 'Contributors'}</h2>
                    <button
                        style={{'outline': 'none'}}
                        className="text-white bg-primary-500 font-semibold text-center rounded-full py-1 px-5 mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                        onClick={async () => {
                            // await updatePlaylist(user.uid, groupId, playlistID, timeRange, limitPerPerson)
                            await updatePlaylist(user.uid, groupId, playlistID)
                            refreshPlaylist(playlistID)
                        }}
                    >
                        Update Playlist
                    </button>
                </div>
                <div id="right" className="lg:w-full ml-5 md:ml-20 lg:ml-0 pr-5 md:pr-10 lg:pr-20">
                    <div className="list-of-tracks w-full -mt-3">
                        {playlistTracks && playlistTracks.map((track) => (
                            <a key={track.id} href={track.song_url} target="_blank" rel="noop  ener noreferrer">
                                <div className="flex flex-row w-full px-4 py-1 mb-4 hover:bg-primary-400 hover:bg-opacity-15 transition duration-300 ease-in-out group">
                                <img className="mr-3" width="75px" height="75px" src={track.image_url} alt={track.name} />
                                    <div id="desc" className="w-full flex flex-col justify-center">
                                        <div>
                                            <div className="flex flex-row w-full justify-between">
                                                <div className="pr-3">
                                                    <p className="text-white mb-1 group-hover:underline">{track.name}</p>
                                                </div>
                                                <p className="text-gray-400 font-thin mb-1">{track.duration_min}:{track.duration_sec < 10 ? '0' : ""}{track.duration_sec}</p>
                                            </div>
                                            <div className="pr-10">
                                                {track.artists && track.artists.map((artist, index) => (
                                                    <span key={index} className="text-gray-400">{artist} {(index + 1 === track.artists.length) ? "" : (<span>&#183;</span>)} </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}