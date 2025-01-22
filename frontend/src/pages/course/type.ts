interface CourseDetail {
    id: number;
    date: string;
    reason: string;
    course_name: string;
}

type CourseCardType = CourseDetail[];

type courseType = "e" | "s" | "m" | "c" | "g";

type requestType = ["c", courseType, number];

interface multipleChoiceType {
    options: string[];
}

interface courseCardType {
    detailArray: CourseCardType;
}

export type {
    CourseCardType,
    requestType,
    multipleChoiceType,
    courseType,
    courseCardType,
};
