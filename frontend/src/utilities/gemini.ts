import api from "./api/api";
import { GEMINI_PATH } from "./constants";

interface responseType {
    status: number;
    data: {
        detail: string;
    };
}

async function callGemini(request_type: string, message: string) {
    const route = GEMINI_PATH;
    const response = await api.post(route, { request_type, message });
    if (response.status === 200) {
        return ["SUCCESS", response.data.detail];
    } else {
        return ["ERROR", response.data.detail];
    }
}

const chatWithGemini = async (message: string) => await callGemini("c", message);

const submitFeedback = async (message: string) => await callGemini("f", message);

export { chatWithGemini, submitFeedback };
