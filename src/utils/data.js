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
        name: "The newest coolest playlist",
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
    console.log(groupId)
    const db = firebaseInst.firestore()
    const ref = db.collection(groupsCollection).doc(groupId)
    const doc = await ref.get()
    if (!doc.exists) {
        return null
    }

    const users = doc.data().users
    for (const uid of users) {
        if (uid === user.uid) {
            return true
        }
    }
    return false
}

async function joinGroup(user, groupId) {
    const db = firebaseInst.firestore()
    const ref = db.collection(groupsCollection).doc(groupId)
    return ref.update("users", FieldValue.arrayUnion(user.uid));
}

async function createGroup(user, groupName) {
    const db = firebaseInst.firestore()
    const docRef = await db.collection(groupsCollection).add({
        name: groupName,
        playlist_id: "",
        users: [user.uid],
    })
    db.collection(usersCollection).doc(user.uid).update("groups", FieldValue.arrayUnion(docRef.id))
    return `${process.env.BASE_URI}/app/group/${docRef.id}`
}

async function getGroup(groupId) {
    const db = firebaseInst.firestore()
    const docSnapshot = await db.collection(groupsCollection).doc(groupId).get()
    return docSnapshot.data()
}

async function getUserGroups(uid) {
    const db = firebaseInst.firestore()
    const docSnapshot = await db.collection(groupsCollection).where("users", "array-contains", uid).get()
    let userGroups = []
    docSnapshot.forEach(doc => {
        const docWithID = doc.data()
        docWithID.id = doc.id
        userGroups.push(docWithID)
    })
    return userGroups
    
    // let userGroups = []
    // for (const groupId of groups) {
    //     const groupSnapshot = await db.collection(groupsCollection).doc(groupId).get()
    //     let group = groupSnapshot.data()
    //     group.id = groupSnapshot.id
    //     userGroups.push(group)
    // }
    // return userGroups
}

export { createAndFillPlaylist, getPlaylist, joinGroup, checkIsInGroup, createGroup, getGroup, getUserGroups }