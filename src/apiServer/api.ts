import axios from "axios";
import { IEmailNotification, IRedisCache, ISMSNotification } from "../pages/bookingappointment/bookingConfirmed";

const publishEmailNotifcationUrl = "/api/pubsub/email-notification";
const publishSmsNotificationUrl = "/api/pubsub/sms-notification";
const storeDataInRedisCacheUrl = "/api/redis/appointment";

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

export const publishEmailNotifcation = async (data: IEmailNotification) => {
    try {
        console.log("This is the data in publishEmailNotification method: ", data)
        return await axios.post(publishEmailNotifcationUrl, data)
    } catch (error) {
        console.log(error)
    }
}

export const setAppointmentInRedisCache = async (data: IRedisCache) => {
    try {
        console.log("This appointment data is being stored in the redis cache: ", data)
        return await axios.post(storeDataInRedisCacheUrl, data)
    } catch (error: any) {
        console.log("Error in setAppointmentInRedisCache: ", error)
        return error.status
    }
}


export const publishSmsNotifcation = async (data: ISMSNotification) => {
    try {
        console.log("This is the data in publishSmsNotification method: ", data)
        return await axios.post(publishSmsNotificationUrl, data)
    } catch (error) {
        console.log(error)
    }
}