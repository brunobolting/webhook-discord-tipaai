import axios from "axios";

class Http
{
    async post(url, data) {
        return await axios.post(url, data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            }
        })
    }

    async get(url) {
    }
}

export default new Http
