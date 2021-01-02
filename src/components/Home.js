import React, { useState, useEffect } from "react"
import firebaseInst from "../firebase"

export default function Home({ user }) {
    const [token, setToken] = useState("")
    useEffect(() => {
        if (!user) {
            return
        }
        const db = firebaseInst.firestore()
        db.collection("users").doc(user.uid).get().then(doc => {
            if (doc.exists) {
                setToken(doc.data().curr_token)
            } else {
                console.log("user does not exist")
            }
        })
    }, [])

    return (
        <div>Your token is {token}</div>
    )
}