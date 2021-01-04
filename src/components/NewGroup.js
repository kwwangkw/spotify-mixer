import React from "react"

export default function NewGroup() {
    return (
        <div class="bg-dark-gray text-primary-400 w-full h-screen font-sans">
            <div className="w-full h-full flex flex-col justify-center text-center items-center">
                <div className="border-2 border-primary-400 rounded-3xl p-12">
                    <h1 className="text-white text-5xl mb-7 font-bold">Create Group</h1>
                    <input className="text-3xl mb-6 bg-transparent text-white font-extralight text-center outline-none overflow-visible border-b border-white" placeholder="Your Group's Name" style={{'caretColor': 'transparent'}}/>
                    <button className="mx-auto text-white font-light bg-primary-500 text-xl text-center rounded-full py-2 px-5 flex flex-row">
                        Generate Share Link
                    </button>
                </div>
            </div>
        </div>
    )
}