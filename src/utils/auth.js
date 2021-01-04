import axios from "axios"
import firebaseInst from "../firebase"
import { usersCollection } from "../utils/constants"

function setUserTokens(uid, accessToken, refreshToken, expireSeconds) {
    const db = firebaseInst.firestore()
    const secondsSince1970 = new Date().getTime() / 1000
    return db.collection(usersCollection)
        .doc(uid)
        .set({ 
            curr_token: accessToken, 
            refresh_token: refreshToken, 
            expire_time: secondsSince1970 + expireSeconds,
        }, {merge: true})
}

function setAxiosTokenHeader(accessToken) {
    axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
}

async function getNewAccessToken(uid, refreshToken) {
    const resp = await axios.post(`${process.env.SERVER_URI}/spotify/token/refresh`, {refresh_token: refreshToken})
    const accessToken = resp.data.access_token
    setAxiosTokenHeader(accessToken)
    return setUserTokens(uid, accessToken, refreshToken, resp.data.expires_in)
}

async function getUserData(uid) {
    const db = firebaseInst.firestore()
    const userRef = db.collection(usersCollection).doc(uid)
    const userDoc = await userRef.get()
    return userDoc.data()
}

async function safeAPI(uid, func) {
    const currTime = new Date().getTime() / 1000
    const buffer = 10
    const userData = await getUserData(uid)
    setAxiosTokenHeader(userData.curr_token)
    const refreshToken = userData.refresh_token
    const expireTime = userData.expire_time
    if (currTime + buffer >= expireTime) {
        await getNewAccessToken(uid, refreshToken)
    }
    return func()
}

async function signOut() {
    try {
        firebaseInst.auth().signOut()
    } catch (error) {
        console.error(error)
    }
}


export { setUserTokens, safeAPI, setAxiosTokenHeader, signOut }