import axios from "axios";
import { ACCESS_TOKEN, BASE_URL } from "./constants";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token && token.trim() !== "") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        alert(error);
    }
);

export default api;
