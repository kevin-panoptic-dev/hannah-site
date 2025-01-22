import extracurricularCardsType from "./type";

function shuffle(array: extracurricularCardsType) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [array[i], array[randomIndex]] = [
            array[randomIndex],
            array[i],
        ];
    }

    return array;
}

function serialization(response: extracurricularCardsType) {
    let i = 1;
    for (const card of response) {
        card.id = i;
        i++;
    }
    return response;
}

function filtration(array: extracurricularCardsType) {
    return array.filter((card) => card.image !== null);
}

function addDebugId(array: extracurricularCardsType) {
    for (const card of array) {
        card.extracurricular_name += card.id;
    }
    return array;
}

export { shuffle, filtration, serialization, addDebugId };
