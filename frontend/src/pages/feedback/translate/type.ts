type praiseType = "a" | "e" | "r" | "c" | "g";
type lengthType = "s" | "l";

interface FeedbackModelType {
    id?: number | null;
    title: string;
    praise_type: praiseType;
    length_type: lengthType;
    content: string;
    author: number;
}

interface translateResponseType {
    status: number;
    data: {
        detail: FeedbackModelType[];
    };
}

interface translateResponseFunctionType {
    detailArray: FeedbackModelType[];
}

export type {
    translateResponseType,
    FeedbackModelType,
    lengthType,
    praiseType,
    translateResponseFunctionType,
};
