import axios from "axios"
import firebaseInst from "../firebase"
import { usersCollection } from "../utils/constants"

function setUserTokens(uid, accessToken, refreshToken, expireSeconds) {
    const db = firebaseInst.firestore()
    const secondsSince1970 = new Date().getTime() / 1000
    console.log(secondsSince1970)
    console.log(expireSeconds)
    db.collection(usersCollection)
        .doc(uid)
        .set({ 
            curr_token: accessToken, 
            refresh_token: refreshToken, 
            expire_time: secondsSince1970 + expireSeconds
        })
}

async function safeAPI(uid, func, refreshToken, expireTime) {
    const currTime = new Date().getTime() / 1000
    const buffer = 10
    if (currTime + buffer >= expireTime) {
        const resp = await axios.post(`${process.env.SERVER_URI}/spotify/token/refresh`, {refresh_token: refreshToken})
        const accessToken = resp.data.access_token
        axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
        setUserTokens(uid, accessToken, refreshToken, resp.data.expires_in)
    }
    return func()
}

export { setUserTokens, safeAPI }