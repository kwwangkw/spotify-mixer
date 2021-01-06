import axios from "axios"
import firebaseInst, { FieldValue } from "../firebase"
import { safeAPI } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"

async function createPlaylist(uid, name) {
    let requestBody = {
        name: name,
        public: false,
        collaborative: true,
    }
    return safeAPI(
        uid,
        () => axios.post(`https://api.spotify.com/v1/users/${uid}/playlists`, requestBody),
    )
}

async function getTopTracks(groupID, timeRange, limitPerPerson) {
    const db = firebaseInst.firestore()
    const groupRef = db.collection(groupsCollection).doc(groupID)
    const doc = await groupRef.get()
    if (!doc.exists) {
        throw new Error(`Group ${groupID} does not exist`)
    }
    const users = doc.data().users
    let topTracks = []
    for (const uid of users) {
        try {
            const params = {
                limit: limitPerPerson,
                time_range: timeRange
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
    return topTracks
}

async function fillPlaylist(uid, groupID, playlistID, timeRange, limitPerPerson) {
    const topTracks = await getTopTracks(groupID, timeRange, limitPerPerson)
    console.log(topTracks)
    const requestBody = {
        uris: topTracks
    }
    await safeAPI(
        uid,
        () => axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, requestBody),
    )

    const db = firebaseInst.firestore()
    return db.collection(groupsCollection).doc(groupID).update("playlist_id", playlistID)
}

async function createAndFillPlaylist(user, groupID, name, timeRange, limitPerPerson) {
    if (!name || !["short_term", "medium_term", "long_term"].includes(timeRange) || 
        !Number.isInteger(limitPerPerson) || limitPerPerson <= 0 || limitPerPerson > 50) {
        throw "invalid input"
    }
    const playlist = await createPlaylist(user.uid, name)
    await fillPlaylist(user.uid, groupID, playlist.data.id, timeRange, limitPerPerson)
    return playlist.data
}

async function getPlaylist(user, playlistId) {
    const playlist = await safeAPI(
        user.uid,
        () => axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`)
    )
    return playlist
}

async function updatePlaylist(uid, groupID, playlistID, timeRange, limitPerPerson) {
    const topTracks = await getTopTracks(groupID, timeRange, limitPerPerson)
    const requestBody = {
        uris: topTracks
    }
    return safeAPI(
        uid,
        () => axios.put(`https://api.spotify.com/v1/users/${uid}/playlists/${playlistID}/tracks`, requestBody),
    )
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
    return `/app/group/${docRef.id}`
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
}

async function getUser(uid) {
    const user = await safeAPI(
        uid,
        () => axios.get(`https://api.spotify.com/v1/users/${uid}`),
    )
    return user.data
}

export { createAndFillPlaylist, updatePlaylist, getPlaylist, joinGroup, checkIsInGroup, createGroup, getGroup, getUserGroups, getUser }