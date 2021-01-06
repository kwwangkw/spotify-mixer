import React, { useState } from "react"
import { navigate, Link } from "gatsby"
import { createGroup } from "../utils/data"

export default function NewGroup({ user }) {
    const [groupName, setGroupName] = useState("Untitled Group")

    return (
        <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <div className="border-2 border-transparent rounded-3xl pb-16 pt-20 px-24">
                    <h1 className="text-primary-400 font-semi-bold text-5xl mb-16">Start Exploring: <span className="text-white font-thin text-5xl mb-10">Create a Group</span></h1>
                    <input 
                        className="text-3xl mb-12 bg-transparent text-white font-thin text-center outline-none overflow-visible border-b border-white" 
                        placeholder="Your Group's Name" 
                        //style={{'caretColor': 'transparent'}}
                        //value={groupName}
                        onChange={e => 
                            setGroupName(e.target.value)
                        }
                    />
                    <div className="flex flex-row">
                        <button 
                            className="ml-auto mr-1 text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                            style={{'outline': 'none'}}
                            onClick={async () => {
                                const val = await createGroup(user, groupName)
                                navigate(val)
                            }}
                        >
                            Create Group
                        </button>
                        <button 
                            style={{'outline': 'none'}}
                            className="mr-auto ml-1 py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                        >
                            <Link to={"/app/home"}>
                                Cancel
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}