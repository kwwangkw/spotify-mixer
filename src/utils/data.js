import axios from "axios"
import firebaseInst from "../firebase"
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
    const requestBody = {
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
    // playlist.data.id
}

export { createAndFillPlaylist }