const horizontalBarNumber = 12;
const barHeight =
    2 *
    1.1 *
    Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
const barWidth = window.innerWidth / horizontalBarNumber;
const verticalBarNumber = Math.ceil(window.innerHeight / barWidth);
const horizontalSpeed = window.innerWidth / 0.8 / 60;
const verticalSpeed =
    (window.innerHeight / window.innerWidth) * horizontalSpeed;

export {
    horizontalBarNumber,
    barHeight,
    barWidth,
    verticalBarNumber,
    horizontalSpeed,
    verticalSpeed,
};
