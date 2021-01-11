import React from "react"
import cryptoRandomString from "crypto-random-string"
import { accountsAuthorizeURI, projectTitle } from "../utils/constants"
import SEO from "./seo"

export default function Login({ location }) {
    const redirect_uri = (location.state && location.state.redirectTo) ? (process.env.REDIRECT_URI_AUTHREDIR) : (process.env.REDIRECT_URI)
    return (
        <div className="bg-dark-gray text-primary-400 w-full h-screen">
            <SEO title={projectTitle} />
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <h1 className="text-5xl font-bold mb-2">Spotify<span className="text-white font-extralight">Mixer</span></h1>
                <h2 className="text-2xl mb-7 text-gray-400 font-extralight">Create playlists with friends.</h2>
                <div id="login-button">
                    <button style={{'outline': 'none'}} className="text-dark-gray font-light bg-primary-500 text-lg text-center rounded-full py-2 px-5 flex flex-row hover:bg-primary-400 transition duration-300 ease-in-out">
                        <a href={
                            `${accountsAuthorizeURI}`+
                            `?response_type=code`+ 
                            `&client_id=${process.env.CLIENT_ID}`+
                            `&redirect_uri=${redirect_uri}`+
                            `&scope=user-top-read playlist-modify-public playlist-modify-private`+
                            `&state=${cryptoRandomString({length: 10})}`
                        }>Log in with Spotify</a>
                    </button>
                </div>
            </div>
        </div>
    )
}