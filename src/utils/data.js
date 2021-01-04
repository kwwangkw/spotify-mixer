import axios from "axios"
import { async } from "crypto-random-string"
import firebaseInst, { FieldValue, FieldPath } from "../firebase"
import { safeAPI } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"

async function createAndFillPlaylist(user, groupID) {
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
            const params = {
                limit: 10
            }
            let userTopTracks = await safeAPI(
                uid,
                () => axios.get(`https://api.spotify.com/v1/me/top/tracks`, {
                    params: params
                }),
            )
            userTopTracks = userTopTracks.data
            for (const tracks of userTopTracks.items) {
                topTracks.push(tracks.uri)
            }
        } catch(err) {
            console.log(err)
        }
    }

    let requestBody = {
        name: "Coolio Richard Broolio Playlist",
        public: false,
        collaborative: true,
    }
    const playlist = await safeAPI(
        user.uid,
        () => axios.post(`https://api.spotify.com/v1/users/${user.uid}/playlists`, requestBody),
    )
    requestBody = {
        uris: topTracks
    }
    await safeAPI(
        user.uid,
        () => axios.post(`https://api.spotify.com/v1/playlists/${playlist.data.id}/tracks`, requestBody),
    )

    ref.update("playlist_id", playlist.data.id)

    return playlist.data
}

async function getPlaylist(user, playlistId) {
    const playlist = await safeAPI(
        user.uid,
        () => axios.post(`https://api.spotify.com/v1/playlists/${playlistId}`)
    )
    return playlist
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

async function createGroup(user, groupName) {
    const db = firebaseInst.firestore()
    const docRef = await db.collection(groupsCollection).add({
        name: groupName,
        playlist_id: "",
        users: [user.uid],
    })
    db.collection(usersCollection).doc(user.uid).update("groups", FieldValue.arrayUnion(docRef.id))
    return `http://localhost:8000/app/group/${docRef.id}`
}

async function getGroup(groupId) {
    const db = firebaseInst.firestore()
    const docSnapshot = await db.collection(groupsCollection).doc(groupId).get()
    return docSnapshot.data()
}

export { createAndFillPlaylist, getPlaylist, joinGroup, checkIsInGroup, createGroup, getGroup }