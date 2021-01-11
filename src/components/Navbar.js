import React, { useState, useEffect } from "react"
import { navigate, Link } from "gatsby"
import { getUser } from "../utils/data"
import { safeAPI, signOut } from "../utils/auth"

export default function Navbar({user}) {
    const [displayName, setDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    useEffect(() => {
        if(!user){
            return
        }
        getUser(user.uid).then(val => {
            setDisplayName(val.display_name)
            setProfilePicture(val.images[0].url)
            console.log(val.images[0].url)
        })
    }, [])
    
    return (
        <div className="bg-light-gray py-2 px-5 md:px-10 flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <Link to={"/app/home"}>
                    <div className="text-white flex flex-row items-center group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="group-hover:text-primary-400 transition duration-100 ease-in-out"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                        <p className="ml-1 text-primary-400">spotify<span className="text-white">mixer</span></p>
                    </div>
                </Link>
                <button type="button" onClick={signOut} style={{'outline': 'none'}}>
                    <div className="text-white flex flex-row items-center group hover:bg-primary-500 transition duration-200 ease-in-out pl-4 rounded-full">
                        <p className="mr-3 text-dark-gray font-medium opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out">Logout</p>
                        <div className="grid grid-cols-1">
                            <img src={profilePicture} className="rounded-full z-0 relative col-start-1 row-start-1" style={{'objectFit':'cover', 'width': '45px', 'height': '45px'}}/>
                            <div className="rounded-full z-10 bg-opacity-0 group-hover:bg-opacity-0 transition duration-100 ease-in-out bg-primary-300 col-start-1 row-start-1 w-full h-full flex items-center justify-center"></div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}