import axios from "axios";
import { ACCESS_TOKEN, BASE_URL } from "./constants";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(
    (config) => {
        const token = localStorage.get(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        alert(error);
    }
);

export { api };
