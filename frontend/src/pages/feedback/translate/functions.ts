import { FeedbackModelType, praiseType } from "./type";

function serialization(cards: FeedbackModelType[]) {
    let i = 1;
    const array = [...cards];
    for (const card of array) {
        card.id = i;
        i++;
    }

    return array;
}

function shuffle(array: FeedbackModelType[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] = [
            array[randomIndex],
            array[i],
        ];
    }

    return array;
}

function match(key: praiseType) {
    const praiseMap: Record<praiseType, string> = {
        a: "academic strength",
        e: "extracurricular activities",
        r: "relationship with people",
        c: "career exploration",
        g: "other",
    };
    return praiseMap[key];
}

export { serialization, shuffle, match };
