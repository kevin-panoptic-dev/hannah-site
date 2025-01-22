import { forumMessageType } from "../type";

function getMessage(messageArray: forumMessageType[], id: number) {
    const result = messageArray.filter((card) => card.id == id);
    if (result) {
        return result[0];
    } else {
        return undefined;
    }
}

function formatDate(isoString: string) {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat(
        "en-US",
        options
    ).format(date);

    return `on ${formattedDate}`;
}

export { getMessage, formatDate };
