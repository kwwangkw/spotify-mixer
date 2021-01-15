import axios from "axios"
import firebase from "gatsby-plugin-firebase"
import { usersCollection, profileURI } from "../utils/constants"

function setUserTokens(uid, accessToken, refreshToken, expireSeconds) {
    const db = firebase.firestore()
    const secondsSince1970 = new Date().getTime() / 1000
    return db.collection(usersCollection)
        .doc(uid)
        .set({ 
            curr_token: accessToken, 
            refresh_token: refreshToken, 
            expire_time: secondsSince1970 + expireSeconds,
            timestamp: firebase.firestore.firebase.firestore.FieldValue.serverTimestamp(),
        }, {merge: true})
}

function setAxiosTokenHeader(accessToken) {
    axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
}

async function getNewAccessToken(uid, refreshToken) {
    const resp = await axios.post(`${process.env.GATSBY_SERVER_URI}/spotify/token/refresh`, {refresh_token: refreshToken})
    const accessToken = resp.data.access_token
    setAxiosTokenHeader(accessToken)
    return setUserTokens(uid, accessToken, refreshToken, resp.data.expires_in)
}

async function getUserData(uid) {
    const db = firebase.firestore()
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
        firebase.auth().signOut()
    } catch (error) {
        console.error(error)
    }
}

async function getFirebaseToken() {
    const spotifyID = await axios.get(profileURI).then(res => res.data.id)
    try {
        const res = await axios.post(`${process.env.GATSBY_SERVER_URI}/token`, {spotifyID: spotifyID})
        return firebase.auth().signInWithCustomToken(res.data.firebaseToken)
    } catch(err) {
        console.log(err)
    }
}

async function loginWithSpotify(code, other_redir) {
    const res = await axios.post(`${process.env.GATSBY_SERVER_URI}/spotify/token`, { code: code, other_redir: other_redir })
    const [ accessToken, refreshToken, expiresIn ] = [ res.data.access_token, res.data.refresh_token, res.data.expires_in ]
    setAxiosTokenHeader(accessToken)
    const user = await getFirebaseToken()
    return setUserTokens(user.user.uid, accessToken, refreshToken, expiresIn)
}

export { setUserTokens, safeAPI, setAxiosTokenHeader, signOut, loginWithSpotify }
