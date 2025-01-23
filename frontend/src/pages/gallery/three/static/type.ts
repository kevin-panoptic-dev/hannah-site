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

type counter = 0 | 1 | 2 | 3;

export type { galleryCard, ThreeType, counter };
