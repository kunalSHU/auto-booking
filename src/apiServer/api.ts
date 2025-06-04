import axios from "axios";

const backendTarget = process.env.BACKEND_PROXY_TARGET || 'http://localhost:4201';

export const callNodeHelloWorld = async () => {
    try {
        return await axios.get(backendTarget + "/api/test")
    } catch (error) {
        console.log(error)
    }
}