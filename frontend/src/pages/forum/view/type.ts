interface forumMessageType {
    id: number;
    date: string;
    message: string;
    author: string;
    key?: number;
}

interface forumGetResponseType {
    status: number;
    data: {
        detail: forumMessageType[];
    };
}

interface forumMessageInterface {
    detailArray: forumMessageType[];
}

interface DecodedTokenType {
    username?: string;
    is_admin?: boolean;
    [key: string]: unknown;
}

interface forumDeleteResponseType {
    status: 403 | 200 | 400;
    data: {
        detail: string;
    };
}

export type {
    forumMessageType,
    forumGetResponseType,
    forumMessageInterface,
    DecodedTokenType,
    forumDeleteResponseType,
};
