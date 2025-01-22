interface feedbackFormType {
    title: string;
    content: string;
}

interface transcribeResponseType {
    status: number;
    data: {
        detail: string;
    };
}

export type { feedbackFormType, transcribeResponseType };
