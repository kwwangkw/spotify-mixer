import axios from "axios"
import firebaseInst, { FieldValue, FieldPath } from "../firebase"
import { safeAPI } from "../utils/auth"
import { usersCollection, groupsCollection } from "../utils/constants"

async function createAndFillPlaylist(user, groupID, refreshToken, expireTime) {
    console.log("createAndFillPlaylist")
    const db = firebaseInst.firestore()
    const ref = db.collection(groupsCollection).doc(groupID)
    const doc = await ref.get()
    if (!doc.exists) {
        return
    }

    const users = doc.data().users
    let topTracks = []
    for (const uid of users) {
        try {
            const userRef = db.collection(usersCollection).doc(uid)
            const userDoc = await userRef.get()
            const userData = userDoc.data()

            const params = {
                limit: 10
            }
            let userTopTracks = await safeAPI(
                uid,
                () => axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
                    params: params
                }),
                userData.refresh_token,
                userData.expireTime
            )
            userTopTracks = userTopTracks.data
            console.log(userTopTracks)
            for (const tracks of userTopTracks.items) {
                topTracks.push(tracks.uri)
            } 
        } catch(err) {
            console.log(err)
        }
    }
    console.log(topTracks);

    let requestBody = {
        name: "Coolio Playlist",
        public: false,
        collaborative: true,
    }
    const playlist = await safeAPI(
        user.uid,
        () => axios.post(`https://api.spotify.com/v1/users/${user.uid}/playlists`, requestBody),
        refreshToken,
        expireTime
    )
    console.log(playlist.data)
    requestBody = {
        uris: topTracks
    }
    await safeAPI(
        user.uid,
        () => axios.post(`https://api.spotify.com/v1/playlists/${playlist.data.id}/tracks`, requestBody),
        refreshToken,
        expireTime,
    )
    return playlist.data
}

async function checkIsInGroup(user, groupId) {
    const db = firebaseInst.firestore()
    const ref = db.collection(groupsCollection)
    const snapshot = await ref.where(FieldPath.documentId(), "==", groupId)
                        .where("users", "array-contains", user.uid)
                        .get()
    return !snapshot.empty
}

async function joinGroup(user, groupId) {
    console.log("joinGroup")
    const db = firebaseInst.firestore()
    const ref = db.collection(groupsCollection).doc(groupId)
    console.log(user);
    ref.update("users", FieldValue.arrayUnion(user.uid));
}

export { createAndFillPlaylist, joinGroup, checkIsInGroup }