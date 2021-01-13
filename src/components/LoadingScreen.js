import React from "react"

export default function LoadingScreen() {
    return (
        <div className="bg-dark-gray min-h-screen w-full flex justify-center items-center text-center">
            <div className="text-white flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-400 animate-pulse"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                <p className="text-primary-400 text-5xl">spotify<span className="text-white">mixer</span></p>
            </div>
        </div>
    )
}