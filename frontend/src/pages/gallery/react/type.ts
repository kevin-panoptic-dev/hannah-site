interface galleryCardType {
    id: number;
    title: string;
    description: string;
    image: string;
}

interface galleryResponseType {
    status: number;
    data: {
        detail: galleryCardType[];
    };
}

export type { galleryCardType, galleryResponseType };
