import axios ,{ Axios } from "axios";

export const AxiosScreenshot: Axios = axios.create ({
    baseURL: import.meta.env.VITE_MEDIA_API_URL || "https://fluestdog-ssapi.vercel.app/api"
})