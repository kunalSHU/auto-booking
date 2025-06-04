import axios from "axios";

export const callNodeHelloWorld = async () => {
    try {
        // const url = backendTarget + "/api/test"
        const url = "/api/test";
        console.log("This is the test url: ", url)
        return await axios.get(url)
    } catch (error) {
        console.log(error)
    }
}