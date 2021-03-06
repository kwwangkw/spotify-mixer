import React, { useState, useEffect } from "react"
import { Link } from "gatsby"
import { getUser } from "../../utils/data"
import { signOut } from "../../utils/auth"

export default function Navbar({user}) {
    const [displayName, setDisplayName] = useState("")
    const [profilePicture, setProfilePicture] = useState("")
    useEffect(() => {
        if(!user){
            return
        }
        getUser(user.uid).then(val => {
            setDisplayName(val.display_name)
            if (!val.images || val.images.length == 0)
                //setProfilePicture("https://o.dlf.pt/dfpng/smallpng/276-2761324_transparent-default-avatar-png-profile-no-image-icon.png")
                setProfilePicture("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2100&q=80")
            else
                setProfilePicture(val.images[0].url)
        })
    }, [])
    
    return (
        <div className="bg-light-gray py-2 px-5 md:px-10 flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <Link to={"/app/home"}>
                    <div style={{'outline': 'none'}} className="text-white flex flex-row items-center group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary-400 transition duration-100 ease-in-out"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                        <p className="ml-1 text-primary-400">spotify<span className="text-white">mixer</span></p>
                    </div>
                </Link>
                <button type="button" onClick={signOut} style={{'outline': 'none'}}>
                    <div className="text-white flex flex-row items-center group bg-primary-500 md:bg-transparent hover:bg-primary-500 transition duration-200 ease-in-out pl-4 rounded-full">
                        <p className="mr-3 text-dark-gray font-medium opacity-100 md:opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out">Logout</p>
                        <div className="grid grid-cols-1">
                            <img src={profilePicture} alt="Logout" className="rounded-full z-0 relative col-start-1 row-start-1" style={{'objectFit':'cover', 'width': '45px', 'height': '45px'}}/>
                            <div className="rounded-full z-10 bg-opacity-0 group-hover:bg-opacity-0 transition duration-100 ease-in-out bg-primary-300 col-start-1 row-start-1 w-full h-full flex items-center justify-center"></div>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    )
}