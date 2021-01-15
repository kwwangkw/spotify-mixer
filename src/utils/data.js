import axios from "axios"
import firebase from "gatsby-plugin-firebase"
import { safeAPI } from "../utils/auth"
import { groupsCollection, usersCollection } from "../utils/constants"

async function createPlaylist(uid, playlistName) {
    let requestBody = {
        name: playlistName,
        public: false,
        collaborative: true,
    }
    return safeAPI(
        uid,
        () => axios.post(`https://api.spotify.com/v1/users/${uid}/playlists`, requestBody),
    )
}

async function getTopTracks(groupID, timeRange, limitPerPerson) {
    const db = firebase.firestore()
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

async function setGroup(groupID, group) {
    group.timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const db = firebase.firestore()
    return db.collection(groupsCollection).doc(groupID).update(group)
}

async function fillPlaylist(uid, groupID, playlistName, playlistID, timeRange, limitPerPerson) {
    const topTracks = await getTopTracks(groupID, timeRange, limitPerPerson)
    const requestBody = {
        uris: topTracks
    }
    await safeAPI(
        uid,
        () => axios.post(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, requestBody),
    )
    return setGroup(groupID, {
        playlist_id: playlistID,
        playlist_name: playlistName,
        time_range: timeRange,
        limit_per_person: limitPerPerson,
        creator: uid,
    })
}

async function createAndFillPlaylist(user, groupID, playlistName, timeRange, limitPerPerson) {
    if (!playlistName) {
        throw "playlistName"
    }
    if (!["short_term", "medium_term", "long_term"].includes(timeRange)) {
        throw "timeRange"
    } 
    if (!Number.isInteger(limitPerPerson) || limitPerPerson <= 0 || limitPerPerson > 50) {
        throw "limitPerPerson"
    }
    const playlist = await createPlaylist(user.uid, playlistName)
    await fillPlaylist(user.uid, groupID, playlistName, playlist.data.id, timeRange, limitPerPerson)
    return playlist.data
}

async function getPlaylist(user, playlistID) {
    const playlist = await safeAPI(
        user.uid,
        () => axios.get(`https://api.spotify.com/v1/playlists/${playlistID}`)
    )
    return playlist
}

async function getPlaylistForGroup(groupID) {
    const db = firebase.firestore()
    const snapshot = await db.collection(groupsCollection).doc(groupID).get()
    const data = snapshot.data()
    return data
}

async function updatePlaylist(groupID, playlistID) {
    const playlist = await getPlaylistForGroup(groupID)
    const topTracks = await getTopTracks(groupID, playlist.time_range, playlist.limit_per_person)
    const requestBody = {
        uris: topTracks
    }
    const creator = playlist.creator
    return safeAPI(
        creator,
        () => axios.put(`https://api.spotify.com/v1/users/${creator}/playlists/${playlistID}/tracks`, requestBody),
    )
}

async function checkIsInGroup(user, groupId) {
    const db = firebase.firestore()
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
    const db = firebase.firestore()
    const ref = db.collection(groupsCollection).doc(groupId)
    return ref.update({
        users: firebase.firestore.FieldValue.arrayUnion(user.uid),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

async function leaveGroup(uid, groupId) {
    const db = firebase.firestore()
    const doc = db.collection(groupsCollection).doc(groupId)
    const docContents = await doc.get()
    if (!docContents.exists) {
        throw new Error("attempting to leave group that does not exist")
    }
    const data = docContents.data()
    if (data.users && data.users.length === 1) {
        return doc.delete()
    }
    return doc.update({
        users: firebase.firestore.FieldValue.arrayRemove(uid),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

async function createGroup(user, groupName) {
    const db = firebase.firestore()
    const docRef = await db.collection(groupsCollection).add({
        name: groupName,
        playlist_id: "",
        users: [user.uid],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    db.collection(usersCollection).doc(user.uid).update({ 
        groups: firebase.firestore.FieldValue.arrayUnion(docRef.id),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
    return `/app/group/${docRef.id}`
}

async function getGroup(groupId) {
    const db = firebase.firestore()
    const docSnapshot = await db.collection(groupsCollection).doc(groupId).get()
    return docSnapshot.data()
}

async function getUserGroups(uid) {
    const db = firebase.firestore()
    const docSnapshot = await db.collection(groupsCollection).where("users", "array-contains", uid).orderBy("name", "asc").get()
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

export { createAndFillPlaylist, updatePlaylist, getPlaylist, joinGroup, checkIsInGroup, createGroup, getGroup, getUserGroups, getUser, leaveGroup }