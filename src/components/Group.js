import React, { useState, useEffect } from "react"
import axios from "axios"
import firebaseInst from "../firebase"
import { setAxiosTokenHeader } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"
import { createAndFillPlaylist, getPlaylist, joinGroup, checkIsInGroup, getGroup } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"
import { navigate, useScrollRestoration } from "gatsby"


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
    const [token, setToken] = useState("")
    const [refreshToken, setRefreshToken] = useState("")
    const [expireTime, setExpireTime] = useState(0)
    const [isInGroup, setIsInGroup] = useState(null)
    const [groupName, setGroupName] = useState("")
    const [playlistLink, setPlaylistLink] = useState("")
    const [groupMembers, setGroupMembers] = useState([])
    const [isCopied, setIsCopied] = useState(false)
    const [nullMessage, setNullMessage] = useState("Loading...")


    function copyToClipboard(){
        var temp = document.createElement('input'),
        text = window.location.href;

        document.body.appendChild(temp);
        temp.value = text;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    }

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
            <div class="bg-dark-gray text-primary-400 w-full h-screen font-sans">
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
                        <a href={"/app/home"}>
                            Decline
                        </a>
                    </button>
                </div>
            </div>
        )
    }
    if (playlistLink == "") {
        return (
            <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
                <div className="w-full h-full flex flex-col justify-center text-center items-center">
                    <div className="flex flex-row">
                        <h1 className="text-white font-medium text-5xl mb-3">{groupName}<span></span></h1>
                        <button style={{'outline': 'none'}} className="relative group text-primary-400 mb-3 text-5xl hover:text-primary-300 transition duration-300 ease-in-out"
                                onClick={() => {
                                    copyToClipboard()
                                    setIsCopied(true)
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
                        <span> &#183; </span>{groupMembers.map(member => <span key={member}>{member} &#183; </span>)}
                    </div>
                    <h2 className="border-2 border-primary-400 p-5 rounded-2xl text-white font-extralight text-3xl mb-16">It doesn't look like you've created a playlist for this group yet!</h2>
                    <button
                        style={{'outline': 'none'}}
                        className="text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                        onClick={async () => {
                            const playlist = await createAndFillPlaylist(user, groupId, refreshToken, expireTime)
                            setPlaylistLink(playlist.external_urls.spotify)
                        }}
                        disabled={refreshToken === "" || expireTime === 0}
                    >
                        Generate Playlist
                    </button>
                    <button
                        style={{'outline': 'none'}}
                        className="py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                    >
                        <a href={"/app/home"}>
                            Home
                        </a>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <h1 className="text-white font-medium text-5xl mb-12">{groupName}</h1>
                <button
                    style={{'outline': 'none'}}
                    className="text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
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
                    style={{'outline': 'none'}}
                    className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
                >
                    <a href={"/app/home"}>
                        Cancel
                    </a>
                </button>
            </div>
        </div>
    )
}