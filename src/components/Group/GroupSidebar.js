import React from "react";
import { copyToClipboard } from "../../utils/frontend"
import { updatePlaylist } from "../../utils/data"

export default function GroupSidebar({
    groupId,
    isCopied,
    setCopyTimeout,
    playlistID,
    playlistName,
    playlistLink,
    playlistImageLink,
    playlistTracks,
    setIsGen,
    refreshPlaylist,
}) {
    return (
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
                    setTimeout(() => setIsGen(false), 2000)
                }}
            >
                Update Playlist
            </button>
            <button
                style={{'outline': 'none'}}
                className="text-white bg-gray-500 font-semibold text-center rounded-full py-1 px-5 mb-5 hover:bg-primary-500 transition duration-300 ease-in-out"
                onClick={async () => {
                    copyToClipboard()
                    setCopyTimeout(1000)
                }}
            >
                Invite Friends
                <span className={`${ isCopied ? `block` : `hidden` } text-xs text-center md:text-right font-thin ml-1`}>Invite Link Copied!</span>
            </button>
        </div>
 
    )
}