import React, { useState } from "react"
import GroupHeader from "./GroupHeader"
import { copyToClipboard } from "../../utils/frontend"
import { createAndFillPlaylist } from "../../utils/data"

export default function GeneratePlaylistForm({ 
    user,
    groupId,
    isCopied,
    setCopyTimeout,
    setPlaylistID,
    playlistName,
    setPlaylistName,
    setPlaylistLink,
    refreshPlaylist,
    setIsGen,
}) {
    const DEFAULT_LIMIT_PER_PERSON = 10
    const DEFAULT_TIME_RANGE = "medium_term"

    const [invalidInput, setInvalidInput] = useState(null)
    const [limitPerPerson, setLimitPerPerson] = useState(DEFAULT_LIMIT_PER_PERSON)
    const [timeRange, setTimeRange] = useState(DEFAULT_TIME_RANGE)

    console.log("In PlaylistFORM");

    return (
        <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 flex flex-col items-center md:items-end justify-center text-center md:text-right pt-0 -mt-10 -mb-16 md:mb-10 md:pr-5 lg:pl-40 md:pt-10">
                <h2 className="flex border-none -mb-3 p-5 text-primary-400 font-medium text-3xl md:text-4xl">Ahhhh!</h2>
                <h2 className="flex border-none -mt-3 p-5 text-gray-400 font-extralight text-3xl md:text-4xl">You haven't created a playlist for this group yet- let's get started!</h2>
                <button
                    style={{'outline': 'none'}}
                    className="invisible md:visible md:mr-5 text-white bg-gray-500 font-semibold text-center rounded-full py-1 px-5 mb-16 hover:bg-primary-500 transition duration-300 ease-in-out"
                    onClick={async () => {
                        copyToClipboard()
                        setCopyTimeout(1000)
                    }}
                >
                    {isCopied ? "Link Copied!" : "Invite Friends"}
                </button>
            </div>

            <div className="flex flex-col text-white text-lg items-center md:pl-5 -mt-10 md:mt-0 pt-10 md:pt-0 md:border-l border-gray-500">
                <label className="text-primary-400 text-md md:text-xl font-light">Playlist Name</label>
                <input 
                    className={"text-3xl bg-transparent text-white font-thin text-center outline-none overflow-visible border-b px-0 " + (invalidInput === "playlistName" ? "border-red-500" : "border-gray-500 mb-8")} 
                    placeholder="e.g. Raining Whales"
                    value={playlistName}
                    onChange={e => setPlaylistName(e.target.value)}
                />
                {invalidInput === "playlistName" && (<p className="text-red-400 font-thin text-center mb-8">Please enter a playlist name</p>)}
                <label className="text-primary-400 text-md md:text-xl font-light">Tracks per Contributor</label>
                <div className="w-1/4 flex flex-col items-center">
                    <input 
                        type="number"
                        min="1"
                        max="50"
                        value={limitPerPerson.toString()}
                        onChange={e => setLimitPerPerson(parseFloat(e.target.value))}
                        className={"text-2xl bg-transparent text-white font-thin text-center outline-none overflow-visible border-b " + (invalidInput === "limitPerPerson" ? "border-red-500" : "border-gray-500 mb-8")}
                    />
                    {invalidInput === "limitPerPerson" && (<p className="text-red-400 font-thin text-center mb-8">1-50</p>)}
                </div>
                <label className="text-primary-400 text-md md:text-xl font-light">Fav Songs From...</label>
                <div className={"flex flex-col lg:flex-row text-xl text-white font-thin text-left lg:text-center " + (invalidInput === "timeRange" ? "" : "mb-8")}>
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
                {invalidInput === "timeRange" && (<p className="text-red-400 font-thin text-center mb-8">Reselect an option</p>)}
                <button
                    style={{'outline': 'none'}}
                    className="text-white font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-16 md:mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                    onClick={async () => {
                        try {
                            setIsGen(true)
                            const playlist = await createAndFillPlaylist(user, groupId, playlistName, timeRange, limitPerPerson)
                            setPlaylistID(playlist.id)
                            setPlaylistLink(playlist.external_urls.spotify)
                            refreshPlaylist(playlist.id)
                            setTimeout(() => setIsGen(false), 2000)
                        } catch(e) {
                            setIsGen(false)
                            if (["playlistName", "timeRange", "limitPerPerson"].includes(e)) {
                                setInvalidInput(e)
                            }
                            else {
                                throw e
                            }
                        }
                    }}
                >
                    Generate Playlist
                </button>
            </div>
        </div>
    )
}