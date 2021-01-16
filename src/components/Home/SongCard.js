import React from "react"

export default function SongCard({ track, rank, insertClassnames }) {
    if (!track) {
        return (
            <span>
                <li className={`${insertClassnames} animate-pulse visible -mb-44 lg:mb-0 p-3 bg-gradient-to-br h-40 rounded-2xl flex items-center text-3xl text-white transform hover:scale-105 transition duration-400 ease-in-out`}>
                    <div className="truncate md:w-4/5">
                    </div>
                </li>
            </span>
        )
    }
    return (
        <a href={track.external_urls['spotify']} target="_blank" rel="noreferrer noopener">
            <li className={`${insertClassnames} -mb-44 lg:mb-0 p-3 bg-gradient-to-br h-40 rounded-2xl flex items-center text-3xl text-white transform hover:scale-105 transition duration-400 ease-in-out`}>
                <img className="ml-1 mr-4 rounded" width="130px" height="130px" src={track.album.images[1]['url']} alt={track.name} />
                <div className="truncate md:w-4/5">
                    <h3 className="text-shadow-lg font-semibold pt-3">#{rank} Song</h3>
                    <h3 className="md:text-4xl text-dark-gray my-1">{track.name}</h3>
                    <div className="flex flex-row">
                        {track.artists.map((artist, index) => (
                            <h3 key={index} className="text-xl text-white text-shadow-lg font-medium pb-3">{artist.name}{(index + 1 === track.artists.length) ? "" : (<span>&thinsp; &#183; &thinsp;</span>)} </h3>
                        ))}
                    </div> 
                </div>
            </li>
        </a>
    )
}