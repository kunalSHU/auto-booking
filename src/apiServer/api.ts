import axios from "axios";
import { IEmailNotification, IRedisCache, ISMSNotification } from "../pages/bookingappointment/bookingConfirmed";

const publishEmailNotifcationUrl = "/api/pubsub/email-notification";
const publishSmsNotificationUrl = "/api/pubsub/sms-notification";
const storeDataInRedisCacheUrl = "/api/redis/appointment";
const getAppointmentInRedisCacheUrl = "/api/redis/user/appointment";
const generateOtpUrl = "/api/otp/generate";
const verifyOtpUrl = "/api/otp/verify";

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * Dedicated Axios instance configured with authentication interceptors.
 */
export const apiClient = axios.create();

// Shared promise for fetching a session token to avoid duplicate concurrent calls
let sessionTokenPromise: Promise<string> | null = null;

export const fetchSessionToken = async (): Promise<string> => {
  if (!sessionTokenPromise) {
    sessionTokenPromise = (async () => {
      try {
        // Use raw axios to prevent recursion
        const response = await axios.get('/api/auth/session');
        const token = response.data?.token;

        if (!token) {
          throw new Error('Received null token from backend');
        }

        localStorage.setItem('sessionToken', token);
        return token;
      } finally {
        sessionTokenPromise = null;
      }
    })();
  }
  return sessionTokenPromise;
};

/**
 * Axios request interceptor for apiClient:
 * 1. Checks for a session token in localStorage.
 * 2. If missing or expired, requests a new session token.
 * 3. Attaches the token in the 'Authorization' header for all outgoing requests.
 */
apiClient.interceptors.request.use(async (config) => {
    // If the request is for the session token endpoint itself, bypass
    if (config.url && config.url.includes('/api/auth/session')) {
        return config;
    }

    let token = localStorage.getItem('sessionToken');

    // Check if token is expired
    const decodedToken = token ? parseJwt(token) : null;
    const isExpired = decodedToken ? Date.now() >= decodedToken.exp * 1000 : false;

    // If there's no token or it's expired, request one
    if (!token || isExpired) {
        try {
            token = await fetchSessionToken();
        } catch (error) {
            console.error('Could not fetch session token:', error);
            return Promise.reject(error);
        }
    }

    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

/**
 * Axios response interceptor for apiClient:
 * Automatically retries once on 401 Unauthorized by obtaining a fresh token.
 */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/api/auth/session')
        ) {
            originalRequest._retry = true;
            try {
                localStorage.removeItem('sessionToken');
                const newToken = await fetchSessionToken();
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (retryError) {
                return Promise.reject(retryError);
            }
        }
        return Promise.reject(error);
    }
);

// Attach request interceptor to global axios as well for backward compatibility
axios.interceptors.request.use(async (config) => {
    if (config.url && config.url.includes('/api/auth/session')) {
        return config;
    }
    let token = localStorage.getItem('sessionToken');
    const decodedToken = token ? parseJwt(token) : null;
    const isExpired = decodedToken ? Date.now() >= decodedToken.exp * 1000 : false;

    if (!token || isExpired) {
        try {
            token = await fetchSessionToken();
        } catch (error) {
            return Promise.reject(error);
        }
    }
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const cancelAppointmentInRedisCache = async (search: any) => {
    try {
        console.log("Cancelling appointment in redis cache");
        return await apiClient.delete(getAppointmentInRedisCacheUrl, { data: search });
    } catch (error: any) {
        console.log("Error in cancelAppointmentInRedisCache: ", error);
        return error;
    }
};

export const publishEmailNotifcation = async (data: IEmailNotification) => {
    try {
        console.log("This is the data in publishEmailNotification method: ", data);
        return await apiClient.post(publishEmailNotifcationUrl, data);
    } catch (error) {
        console.log(error);
    }
};

export const setAppointmentInRedisCache = async (data: IRedisCache) => {
    try {
        console.log("This appointment data is being stored in the redis cache: ", data);
        return await apiClient.post(storeDataInRedisCacheUrl, data);
    } catch (error: any) {
        console.log("Error in setAppointmentInRedisCache: ", error);
        return error;
    }
};

export const getAppointmentInRedisCache = async (search: any) => {
    try {
        console.log("Fetching appointment in redis cache");
        return await apiClient.post(getAppointmentInRedisCacheUrl, search);
    } catch (error: any) {
        console.log("Error in setAppointmentInRedisCache: ", error);
        return error;
    }
};

export const publishSmsNotifcation = async (data: ISMSNotification) => {
    try {
        console.log("This is the data in publishSmsNotification method: ", data);
        return await apiClient.post(publishSmsNotificationUrl, data);
    } catch (error) {
        console.log(error);
    }
};

export const generateOtp = async (data: any) => {
    try {
        console.log("This is the data in generateOtp method: ", data);
        return await apiClient.post(generateOtpUrl, data);
    } catch (error) {
        console.log(error);
    }
};

export const verifyOtp = async (data: any) => {
    try {
        console.log("This is the data in verifyOtp method: ", data);
        return await apiClient.post(verifyOtpUrl, data);
    } catch (error) {
        console.log(error);
    }
};

export default apiClient;