import React from "react"
import cryptoRandomString from "crypto-random-string"
import { accountsAuthorizeURI } from "../utils/constants"

export default function Login() {
    return (
        <div class="bg-dark-gray text-primary-400 w-full h-screen">
            <div class="w-full h-full flex flex-col justify-center text-center items-center">
                <h1 class="text-5xl font-bold mb-2">Spotify<span class="text-white font-extralight">Mixer</span></h1>
                <h2 class="text-2xl mb-7 text-gray-400 font-extralight">Create playlists with friends.</h2>
                <div id="login-button">
                    <button class="text-dark-gray font-medium bg-primary-500 text-lg text-center rounded-full py-2 px-5 flex flex-row">
                        <a href={
                            `${accountsAuthorizeURI}`+
                            `?response_type=code`+ 
                            `&client_id=${process.env.CLIENT_ID}`+
                            `&redirect_uri=${process.env.REDIRECT_URI}`+
                            `&scope=user-top-read playlist-modify-public playlist-modify-private`+
                            `&state=${cryptoRandomString({length: 10})}`
                        }>Log in with Spotify</a>
                    </button>
                </div>
            </div>
        </div>
    )
}