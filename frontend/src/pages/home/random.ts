type courseType = "e" | "s" | "m" | "c" | "s" | "g";

const pool: courseType[] = ["e", "s", "m", "c", "s", "g"];

function getCourseType() {
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
}

function shouldInverse() {
    return Math.random() >= 0.5;
}

export { getCourseType, shouldInverse };
