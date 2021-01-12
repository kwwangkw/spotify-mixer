import React from "react"
import { Link } from "gatsby"
import Navbar from "./Navbar"
import { joinGroup } from "../utils/data"

export default function JoinGroup({ user, groupId, groupName }) {
    return (
        <div className="bg-dark-gray text-primary-400 w-full font-sans min-h-screen">
            <Navbar user={user}/>
            <div className="w-full h-full flex flex-col justify-center text-center items-center pt-16">
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
                >
                    Join Group
                </button>
                <button
                    style={{'outline': 'none'}}
                    className="py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                >
                    <Link to={"/app/home"}>
                        Decline
                    </Link>
                </button>
            </div>
        </div>
    )
}