import axios ,{ Axios } from "axios";

export const AxiosScreenshot: Axios = axios.create ({
    baseURL: "https://fluestdog-ssapi.vercel.app/api"
})