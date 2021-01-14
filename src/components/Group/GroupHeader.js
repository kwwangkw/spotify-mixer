import React from "react"
import { navigate } from "gatsby"
import Navbar from "../Navbar"
import { leaveGroup } from "../../utils/data"

export default function GroupHeader({ user, groupName, groupId, groupMembers, isCopied, setIsCopied, setCopyTimeout,  }) {
     function copyToClipboard(){
        var temp = document.createElement('input'),
        text = window.location.href;

        document.body.appendChild(temp);
        temp.value = text;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
    }
    return (
        <div>
            <Navbar user={user}/>
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <div className="w-full h-full flex flex-col justify-center text-center items-center pt-20 mb-12 lg:mb-20">
                <div className="flex items-center justify-center flex-col md:flex-row">
                    <h1 className="text-white font-medium text-4xl md:text-5xl mb-3">{groupName}<span></span></h1>
                    <button style={{'outline': 'none'}} className="invisible md:visible -mt-8 md:mt-0 relative group text-primary-400 mb-3 text-5xl hover:text-primary-300 transition duration-300 ease-in-out"
                            onClick={() => {
                                copyToClipboard()
                                setIsCopied(true)
                                setCopyTimeout(1000)
                            }}
                    >
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
                        <span className={`${ !isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin invisible ml-1 group-hover:visible `} style={{'top': '2px', 'left' : '110%', 'width': '120px'}}>Copy Invite Link</span>
                        <span className={`${ isCopied ? `block` : `hidden` } absolute z-1 text-xs text-left font-thin ml-1 `} style={{'top': '2px', 'left' : '110%', 'width': '120px'}}>Copied!</span>
                    </button>
                </div>
                <div className="text-gray-400 text-md md:text-lg mb-3">
                    <span> &#183; </span>{groupMembers.map(member => <span key={member.id}>{member.display_name} &#183; </span>)}   
                </div>
                <button
                    style={{'outline': 'none'}}
                    className="text-white bg-gray-500 font-semibold text-center rounded-full py-1 px-5 mb-3 hover:bg-gray-400 transition duration-300 ease-in-out"
                    onClick={async () => {
                        await leaveGroup(user.uid, groupId)
                        navigate("/app/home")
                    }}
                >
                    Leave Group
                </button>
                <button
                    style={{'outline': 'none'}}
                    className="text-white visible md:invisible mb-0 md:-mb-8 bg-gray-500 font-semibold text-center rounded-full py-1 px-5 hover:bg-primary-500 transition duration-300 ease-in-out"
                    onClick={async () => {
                        copyToClipboard()
                        setIsCopied(true)
                        setCopyTimeout(1000)
                    }}
                >
                    Invite Friends
                    <span className={`${ isCopied ? `block` : `hidden` } text-xs text-center md:text-right font-thin ml-1`}>Invite Link Copied!</span>
                </button>
                </div>
            </div>
        </div>
    )
}