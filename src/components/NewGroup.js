import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { createGroup } from "../utils/data"

export default function NewGroup({ user }) {
    const [groupName, setGroupName] = useState("Untitled Group")
    const [shareLink, setShareLink] = useState("")
    const [isClipboardToastVisible, setIsClipboardToastVisible] = useState(false)

    function copyToClipboard() {
        if (shareLink) {
            navigator.clipboard.writeText(shareLink).then(() => {
                setIsClipboardToastVisible(true)
                setTimeout(() => setIsClipboardToastVisible(false), 3000)
            })
        }
    }

    useEffect(() => {
        copyToClipboard()
    }, [shareLink])

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
                                setShareLink(val)
                                navigate(val)
                            }}
                        >
                            Create Group
                        </button>
                        <button 
                            style={{'outline': 'none'}}
                            className="mr-auto ml-1 py-1 text-dark-gray font-extralight bg-gray-500 text-xl text-center rounded-full px-5 flex flex-row mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                        >
                            <a
                                href={"/app/home"}
                            >
                                Cancel
                            </a>
                        </button>
                    </div>
                    {/*
                        {shareLink !== "" ? (
                        <>
                            <div className="border border-transparent rounded-md p-2 text-gray-400 font-light">
                                {shareLink}
                                <button onClick={() => copyToClipboard()}>
                                    <svg 
                                        className="ml-3 h-5 w-5 text-white-500"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />  
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                </button>
                            </div>
                            <p 
                                style={{visibility: isClipboardToastVisible ? "visible" : "hidden"}}
                                className="text-gray-400 font-light"
                            >
                                Copied invite link to clipboard
                            </p>
                        </>
                    ): null}
                    */}
                </div>
            </div>
        </div>
    )
}