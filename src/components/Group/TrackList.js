import React from "react"

export default function TrackList({ playlistTracks }) {
    return (
        <div id="right" className="lg:w-full ml-5 md:ml-20 lg:ml-0 pr-5 md:pr-10 lg:pr-20">
            <div className="list-of-tracks w-full">
                {playlistTracks && playlistTracks.map((track) => (
                    <a key={track.id} href={track.song_url} target="_blank" rel="noop  ener noreferrer">
                        <div className="flex flex-row w-full px-4 py-1 mb-4 hover:bg-primary-400 hover:bg-opacity-15 transition duration-300 ease-in-out group">
                            <div className="flex flex-col">
                                <img className="" width="75px" height="75px" src={track.image_url} alt={track.name} />
                            </div>
                            <div id="desc" className="ml-3 w-full flex flex-col justify-center">
                                <div className="flex flex-row w-full justify-between">
                                    <div className="w-44 md:w-96">
                                        <p className="truncate text-white mb-1 group-hover:underline flex-none">{track.name}</p>
                                    </div>
                                    <p className="text-gray-400 font-thin mb-1 flex-none">{track.duration_min}:{track.duration_sec < 10 ? '0' : ""}{track.duration_sec}</p>
                                </div>
                                <div className="w-44 md:w-96">
                                    <p className="text-gray-400 truncate">
                                        {track.artists && track.artists.map((artist, index) => (
                                            <span key={index} className="text-gray-400">{artist} {(index + 1 === track.artists.length) ? "" : (<span>&#183;</span>)} </span>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}