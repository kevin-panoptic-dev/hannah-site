import api from "./api/api";
import { COURSE_PATH, EXTRA_PATH } from "./constants";

// INFO: 'c' stands for course, 'e' stands for extracurricular
type requestType = ["c", courseType, number] | "e";
type courseType = "e" | "s" | "m" | "c" | "s" | "g";

function requestData(type: requestType) {
    // WARN: This function only return Promise, not the result
    let response;
    if (type === "e") {
        response = api.get(EXTRA_PATH);
    } else if (type[0] === "c") {
        response = api.post(COURSE_PATH, {
            course_type: type[1],
            number_required: type[2],
        });
    } else {
        throw new Error(
            `Course type must be either 'c' or 'e', not ${type}.`
        );
    }
    return response;
}

export default requestData;
