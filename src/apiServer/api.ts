import axios from "axios";
import { IEmailNotification, ISMSNotification } from "../pages/bookingappointment/bookingConfirmed";

const publishEmailNotifcationUrl = "/api/pubsub/email-notification";
const publishSmsNotificationUrl = "/api/pubsub/sms-notification";

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

export const publishSmsNotifcation = async (data: ISMSNotification) => {
    try {
        console.log("This is the data in publishSmsNotification method: ", data)
        return await axios.post(publishSmsNotificationUrl, data)
    } catch (error) {
        console.log(error)
    }
}