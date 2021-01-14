import React, { useState, useEffect } from "react"
import { updatePlaylist, getPlaylist, checkIsInGroup, getGroup, getUser } from "../../utils/data"
import { navigate } from "gatsby"
import LoadingScreen from "../LoadingScreen"
import Navbar from "../Navbar"
import MagicWand from "./MagicWand"
import JoinGroup from "./JoinGroup"
import GeneratePlaylistForm from "./GeneratePlaylistForm"
import "./magicwand.css"
import GroupHeader from "./GroupHeader"
import TrackList from "./TrackList"

export default function Group({ user, groupId }) {
    const [isInGroup, setIsInGroup] = useState(null)
    const [groupName, setGroupName] =   useState("")
    const [playlistID, setPlaylistID] = useState(null)
    const [playlistLink, setPlaylistLink] = useState("")
    const [playlistName, setPlaylistName] = useState("")
    const [playlistImageLink, setPlaylistImageLink] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const [isCopied, setIsCopied] = useState(false)
    const [playlistTracks, setPlaylistTracks] = useState([])
    const [timeoutID, setTimeoutID] = useState(null)
    const [isGen, setIsGen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // For generate playlist form
    const DEFAULT_LIMIT_PER_PERSON = 10
    const [limitPerPerson, setLimitPerPerson] = useState(DEFAULT_LIMIT_PER_PERSON)
    const DEFAULT_TIME_RANGE = "medium_term"
    const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE)

    // playlist input validation
    const [invalidInput, setInvalidInput] = useState("")

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
            setIsLoading(true)
            checkIsInGroup(user, groupId).then(val => {
                if (val !== null) {
                    setIsInGroup(val)
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
                setGroupMembers(newGroupMembers)
                if (group.playlist_id) {
                    setPlaylistID(group.playlist_id)
                    setPlaylistLink(`https://open.spotify.com/playlist/${group.playlist_id}`)
                    refreshPlaylist(group.playlist_id)
                }
            }
            setIsLoading(false)
        }
        func()
    }, [])

    if (isInGroup === null || isLoading) {
        return (
            <LoadingScreen />
        )
    }
    if (!isInGroup) {
        return (
            <JoinGroup user={user} groupId={groupId} groupName={groupName} />
        )
    }
    if (playlistLink === "") {
        return (
            <GeneratePlaylistForm />
        )
    }

    return (
        <div className="bg-dark-gray text-primary-400 w-full min-h-screen font-sans">
            <GroupHeader 
                user={user}
                groupName={groupName}
                groupId={groupId}
                groupMembers={groupMembers}
                isCopied={isCopied}
                setIsCopied={setIsCopied}
                setCopyTimeout={setCopyTimeout}
            />
            {!isGen && <div className="w-full h-full flex flex-col lg:flex-row pb-20 lg:pl-32">
                <div id="left" className="lg:w-1/3 text-center flex flex-col items-center mb-20 lg:mb-0 lg:mr-20">
                    <div className="group">
                        <a href={playlistLink} target="_blank">
                            <div className="grid grid-cols-1 group">
                                <img width="300" height="300" className="z-0 relative col-start-1 row-start-1" src={playlistImageLink} />
                                <div className="z-10 bg-opacity-0 group-hover:bg-opacity-25 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out bg-light-gray col-start-1 row-start-1 w-full h-full flex items-center justify-center">
                                    <svg className="text-primary-300" xmlns="https://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                </div>
                            </div>
                            <h2 className="my-2 text-white font-medium font-2xl group-hover:underline">{playlistName}</h2>
                        </a>
                    </div>
                        <h2 className="mb-10 text-gray-400 font-light mx-auto">{playlistTracks.length} Tracks </h2>
                    <button
                        style={{'outline': 'none'}}
                        className="text-white bg-primary-500 font-semibold text-center rounded-full py-1 px-5 mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                        onClick={async () => {
                            setIsGen(true)
                            await updatePlaylist(groupId, playlistID)
                            refreshPlaylist(playlistID)
                            setTimeout(() => setIsGen(false), 3000)
                        }}
                    >
                        Update Playlist
                    </button>
                    <button
                        style={{'outline': 'none'}}
                        className="text-white bg-gray-500 font-semibold text-center rounded-full py-1 px-5 mb-5 hover:bg-primary-500 transition duration-300 ease-in-out"
                        onClick={async () => {
                            // copyToClipboard()
                            setIsCopied(true)
                            setCopyTimeout(1000)
                        }}
                    >
                        Invite Friends
                        <span className={`${ isCopied ? `block` : `hidden` } text-xs text-center md:text-right font-thin ml-1`}>Invite Link Copied!</span>
                    </button>
                </div>
                <TrackList playlistTracks={playlistTracks} />
            </div>}
            {isGen && (<MagicWand />)}
        </div>
    )
}