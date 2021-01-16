import React from "react"

export default function ArtistCard({ artist, insertClassnames, insertClassnamesA, title }) {
    if (!artist) {
        return (
            <span className={`${insertClassnamesA} -mb-3 md:-mb-10 lg:mb-0`}>
                <li className={`${insertClassnames} animate-pulse p-5 md:p-8 bg-gradient-to-br h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white`}>
                    <div className="primary-600 -ml-2 md:-ml-4 mr-4 rounded-full" width="130px" height="130px" />
                    <div className="truncate w-4/5 pl-1">
                    </div>
                </li>
            </span>        
        )
    }
    return (
        <a href={artist.external_urls['spotify']} target="_blank" rel="noopener noreferrer" className={`${insertClassnamesA} -mb-3 md:-mb-10 lg:mb-0`}>
            <li className={`${insertClassnames} p-5 md:p-8 bg-gradient-to-br h-40 transform hover:scale-105 transition duration-400 ease-in-out rounded-2xl flex items-center text-3xl text-white`}>
                <img className="-ml-2 md:-ml-4 mr-4 rounded-full" width="130px" height="130px" src={artist.images[0]['url']} alt={artist.name}></img>
                <div className="truncate w-4/5 pl-1">
                    <h3 className="text-shadow-lg font-semibold">{title}</h3>
                    <h3 className="md:text-4xl text-dark-gray my-1">{artist.name}</h3>
                </div>
            </li>
        </a>
    ) 
}