import axios from "axios";
import { IEmailNotification, IRedisCache, ISMSNotification } from "../pages/bookingappointment/bookingConfirmed";

const publishEmailNotifcationUrl = "/api/pubsub/email-notification";
const publishSmsNotificationUrl = "/api/pubsub/sms-notification";
const storeDataInRedisCacheUrl = "/api/redis/appointment";
const getAppointmentInRedisCacheUrl = "/api/redis/user/appointment";

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

const parseJwt = (token: any) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Axios request interceptor.
 * This function is called before every request is sent.
 *
 * 1. It checks for a session token in the browser's localStorage.
 * 2. If no token exists, it calls the backend to get a new session token.
 * 3. It stores the new token in localStorage.
 * 4. It adds the token to the 'Authorization' header for all outgoing requests.
 *
 * This ensures that requests originate from a valid application session.
 */
axios.interceptors.request.use(async (config) => {
    // Define an endpoint that should not have the auth token attached.
    const tokenEndpoint = '/api/auth/session';

    // If the current request is for a new token, don't try to attach a token to it.
    if (config.url === tokenEndpoint) {
        return config;
    }

    let token = localStorage.getItem('sessionToken');

    // Check if the token is expired of not
    const decodedToken = token ? parseJwt(token) : null;
    const isExpired = decodedToken ? Date.now() >= decodedToken.exp * 1000 : false;

    // If there's no token, request one from the backend.
    if (!token || isExpired) {
        try {
            const response = await axios.get(tokenEndpoint);
            token = response.data.token; // Assuming the backend returns { token: "..." }

            if (token === null) {
                throw new Error('Received null token from backend');
            }

            localStorage.setItem('sessionToken', token);
        } catch (error) {
            console.error('Could not fetch session token:', error);
            return Promise.reject(error);
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});


export const cancelAppointmentInRedisCache = async (search: any) => {
    try {
        console.log("Cancelling appointment in redis cache")
        return await axios.delete(getAppointmentInRedisCacheUrl, { data: search })
    } catch (error: any) {
        console.log("Error in cancelAppointmentInRedisCache: ", error)
        return error
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
        return error
    }
}

export const getAppointmentInRedisCache = async (search: any) => {
    try {
        console.log("Fetching appointment in redis cache")
        return await axios.post(getAppointmentInRedisCacheUrl, search)
    } catch (error: any) {
        console.log("Error in setAppointmentInRedisCache: ", error)
        return error
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