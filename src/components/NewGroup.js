import React, { useState, useEffect } from "react"
import { createGroup } from "../utils/data"

export default function NewGroup({ user }) {
    const [groupName, setGroupName] = useState("Your Group's Name")
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
                <div className="border-2 border-gray-400 rounded-3xl pb-16 pt-20 px-24">
                    <h1 className="text-white text-5xl mb-7 font-bold">Create Group</h1>
                    <input 
                        className="text-3xl mb-6 bg-transparent text-white font-extralight text-center outline-none overflow-visible border-b border-white" 
                        placeholder="Your Group's Name" 
                        //style={{'caretColor': 'transparent'}}
                        //style={{'text-align': 'left'}}
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                    <button 
                        className="mx-auto text-white font-light bg-primary-500 text-xl text-center rounded-full py-1 px-5 flex flex-row mb-3"
                        onClick={async () => {
                            const val = await createGroup(user, groupName)
                            setShareLink(val)
                        }}
                    >
                        Generate Share Link
                    </button>
                    <button className="mx-auto py-1 text-white font-light bg-red-500 text-xl text-center rounded-full px-5 flex flex-row mb-3">
                        <a
                            href={"/app/home"}
                        >
                            Close
                        </a>
                    </button>
                    {shareLink !== "" ? (
                        <>
                            <div className="border border-transparent rounded-md p-2">
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
                            >
                                Copied share link to clipboard
                            </p>
                        </>
                    ): null}
                </div>
            </div>
        </div>
    )
}