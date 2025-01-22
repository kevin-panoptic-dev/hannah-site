const X_GRADIENT_MOVE_SPEED = 2.5;
const Y_GRADIENT_MOVE_SPEED = 0.75;
const GRADIENT_MOVE_INTERVAL = 20;
const GRADIENT_WIDTH = (2 / 3) * window.innerHeight;
const GRADIENT_MARGIN = 10;

const positiveOutOfBoard = (
    position: number,
    edge: number,
    speed: number
): boolean => {
    if (position + speed > edge) {
        return true;
    } else {
        return false;
    }
};

const negativeOutOfBoard = (
    position: number,
    edge: number,
    speed: number
): boolean => {
    if (position - speed < edge) {
        return true;
    } else {
        return false;
    }
};

const calSpeed = (zoomLevel: number): number => {
    const scalar = 0.2;
    const reducer = 1.8;
    const lim = 500;
    const coefficient = 4;
    let result;
    if (zoomLevel < lim)
        result =
            INITIAL_SPEED *
            (1 + scalar) ** (4 * Math.sqrt(zoomLevel));
    else {
        result = Math.pow(
            INITIAL_SPEED *
                (1 + scalar) **
                    ((coefficient * Math.cbrt(zoomLevel)) /
                        reducer **
                            (Math.pow(zoomLevel, 1 / 10) /
                                reducer ** 2)),
            reducer ** 2
        );
    }

    return result;
};

const CRITICAL_VALUE = 1000;

const INITIAL_LENGTH = 5;

const INITIAL_SPEED = 0.03;

export {
    GRADIENT_MOVE_INTERVAL,
    X_GRADIENT_MOVE_SPEED,
    Y_GRADIENT_MOVE_SPEED,
    GRADIENT_WIDTH,
    GRADIENT_MARGIN,
    positiveOutOfBoard,
    negativeOutOfBoard,
    calSpeed,
    CRITICAL_VALUE,
    INITIAL_LENGTH,
    INITIAL_SPEED,
};
