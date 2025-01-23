const starColorVariants = [
    0xfff8e7, 0xfce8c2, 0xf4d8e6, 0xe5f0ff, 0xfffff0, 0xfdf1d6,
    0xfbe9ec, 0xedf8ff,
];

const width = window.innerWidth;
const height = window.innerHeight;
const adjacent = 0.1;
const opposite = 1000;
const angle = 60;
const camerazhat = 35;
const threshold = 0.002;
const strength = 3.5;
const dumpFactor = 0.03;
const limit = 80;
const boxSize = 0.075;

export {
    width,
    height,
    adjacent,
    opposite,
    angle,
    camerazhat,
    threshold,
    strength,
    dumpFactor,
    limit,
    boxSize,
    starColorVariants,
};
