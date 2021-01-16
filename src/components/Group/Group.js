import React, { useState, useEffect } from "react"
import { getPlaylist, checkIsInGroup, getGroup, getUser } from "../../utils/data"
import firebase from "gatsby-plugin-firebase"
import LoadingScreen from "../LoadingScreen"
import MagicWand from "./MagicWand"
import JoinGroup from "./JoinGroup"
import GeneratePlaylistForm from "./GeneratePlaylistForm"
import "./magicwand.css"
import GroupHeader from "./GroupHeader"
import TrackList from "./TrackList"
import GroupSidebar from "./GroupSidebar"

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
    const [isLoading, setIsLoading] = useState(true)
    const [isGen, setIsGen] = useState(false)

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
        setIsCopied(true)
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
        firebase.analytics().logEvent("Group Screen View")
    }, [])

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
    let bottom;
    if (isGen) {
        bottom = <MagicWand />
    } else if (playlistLink === "") {
        bottom = <GeneratePlaylistForm 
                    user={user}
                    groupId={groupId}
                    isCopied={isCopied} 
                    setCopyTimeout={setCopyTimeout}
                    setPlaylistID={setPlaylistID}
                    playlistName={playlistName}
                    setPlaylistName={setPlaylistName}
                    setPlaylistLink={setPlaylistLink}
                    refreshPlaylist={refreshPlaylist}
                    setIsGen={setIsGen}
                 />
    } else {
        bottom = <div className="w-full h-full flex flex-col lg:flex-row pb-20 lg:pl-32">
                    <GroupSidebar 
                        user={user} 
                        groupId={groupId}
                        isCopied={isCopied}
                        setCopyTimeout={setCopyTimeout}
                        playlistID={playlistID}
                        playlistName={playlistName}
                        playlistLink={playlistLink} 
                        playlistImageLink={playlistImageLink} 
                        playlistTracks={playlistTracks} 
                        setIsGen={setIsGen} 
                        refreshPlaylist={refreshPlaylist} 
                        setCopyTimeout={setCopyTimeout}
                    />
                    <TrackList playlistTracks={playlistTracks} />
                 </div>
    }
    return (
        <>
            <GroupHeader 
                user={user}
                groupName={groupName}
                groupId={groupId}
                groupMembers={groupMembers}
                isCopied={isCopied}
                setIsCopied={setIsCopied}
                setCopyTimeout={setCopyTimeout}
                hasPlaylist={playlistLink !== ""}
            />
            {bottom}
        </>
    )
}