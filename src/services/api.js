import axios from 'axios'

const api = axios.create({
    baseURL: "https://minidrop-backend.herokuapp.com/"
})

export default api 