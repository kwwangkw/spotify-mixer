import React, { useState } from "react"
import { navigate, Link } from "gatsby"
import { createGroup } from "../utils/data"

export default function NewGroup({ user }) {
    const [groupName, setGroupName] = useState("Untitled Group")
    const [warning, setWarning] = useState("")
    const [count, setCount] = useState(0)

    function checkCharacterCount(input){
        return input.length <= 32
    }

    //pb-16 pt-20 px-24

    return (
        <div className="bg-dark-gray text-primary-400 w-full h-screen font-sans">
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <div className="border-2 border-transparent rounded-3xl">
                    <h1 className="flex flex-col md:flex-row text-primary-400 font-semi-bold text-5xl mb-16 mx-auto">Start Exploring: <span className="text-white font-thin text-5xl md:mb-10">Create a Group</span></h1>
                    <div className="w-8/12 md:w-5/12 mx-auto">
                        <input 
                            className="text-2xl md:text-3xl bg-transparent text-white font-thin text-center outline-none overflow-visible border-b border-white" 
                            placeholder="Your Group's Name" 
                            //style={{'caretColor': 'transparent'}}
                            //value={groupName}
                            onChange={e => {
                                setCount(e.target.value.length)
                                setGroupName(e.target.value)
                            }
                            }
                        /> 
                        {(count <= 32 || warning.length == 0) && <p className="mt-1 font-light text-sm text-right">{count} / 32</p>}
                        {(warning.length > 0 && count > 32) && <p className="font-light text-red-400">{warning}</p>}
                    </div>
                    <div className="flex flex-row mt-12">
                        <button 
                            className="ml-auto mr-1 text-dark-gray font-extralight bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3 hover:bg-primary-400 transition duration-300 ease-in-out"
                            style={{'outline': 'none'}}
                            onClick={async () => {
                                if (checkCharacterCount(groupName)){
                                    const val = await createGroup(user, groupName)
                                    navigate(val)
                                }
                                else {
                                    setWarning("You can only use 32 characters")
                                }
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