interface extraDetail {
    id: number;
    date: string;
    extracurricular_name: string;
    reason: string;
    image: string | null;
}

type extracurricularCardsType = extraDetail[];

export default extracurricularCardsType;
