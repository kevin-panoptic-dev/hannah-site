import { CourseCardType } from "./type";

function shuffle(array: CourseCardType) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] = [
            array[randomIndex],
            array[i],
        ];
    }

    return array;
}

function serialization(response: CourseCardType) {
    let i = 1;
    for (const card of response) {
        card.id = i;
        i++;
    }
    return response;
}

export { shuffle, serialization };
