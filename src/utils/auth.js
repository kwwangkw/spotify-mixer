import axios from "axios"

export function safeAPI(func, refreshToken) {
    return func().catch(async (res) => {
        const status_code = res.status_code
        if (status_code === 403 || status_code === 401) { // add condition
            const resp = await axios.post(`${process.env.SERVER_URI}/spotify/token/refresh`, {refresh_token: refreshToken})
            axios.defaults.headers.common = {'Authorization': `Bearer ${resp.data.access_token}`}
            func()
        }
    })
}