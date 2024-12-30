import api from "./api/api";
import { GEMINI_PATH } from "./constants";

interface responseType {
    status: number;
    data: {
        detail: string;
    };
}

async function callGemini(request_type: string, message: string) {
    // const route = GEMINI_PATH;
    // const response = await api.post(route, { request_type, message });
    // if (response.status === 200) {
    //     return ["SUCCESS", response.data.detail];
    // } else {
    //     return ["ERROR", response.data.detail];
    // }
    return [
        "SUCCESS",
        `Recursive setTimeout: Instead of using setInterval, we now define a function typeCharacter that will recursively call itself using setTimeout. This ensures that each character is typed with a random delay before the next character is displayed.
	2.	Random Delay: We calculate a random delay (Math.random() * 150 + 50) for each character, which means that every time a new character is typed, the delay will be different.
	3.	Simplified Logic: Since we no longer need an interval, the logic becomes simpler and more flexible. We just recursively schedule the next character with a delay.`,
    ];
}

const chatWithGemini = async (message: string) => await callGemini("c", message);

const submitFeedback = async (message: string) => await callGemini("f", message);

export { chatWithGemini, submitFeedback };
