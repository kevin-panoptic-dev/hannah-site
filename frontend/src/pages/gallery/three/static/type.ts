interface galleryCard {
    id: number;
    title: string;
    description: string;
    image: string;
}

interface ThreeType {
    container: HTMLElement;
    cards: galleryCard[];
}

export type { galleryCard, ThreeType };
