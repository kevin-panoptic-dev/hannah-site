import * as color from "./colors";

function chooseColor() {
    const colors = [
        color.cool,
        color.neutral,
        color.vibrant,
        color.warm,
    ];
    const colorFamily =
        colors[Math.floor(Math.random() * colors.length)];

    return colorFamily;
}

function pickColor(colorFamily: number[]) {
    const index = Math.floor(Math.random() * colorFamily.length);
    const selectedColor = colorFamily[index];
    return selectedColor;
}

function positions(
    index: number,
    width: number,
    horizontal: number,
    height: number
) {
    const offsetBarLength = height / 2;
    if (index > horizontal) {
        const x = (1 / 2) * window.innerWidth + 10 + offsetBarLength;
        const y =
            (-1 / 2) * window.innerHeight +
            (index - horizontal + 1) * width +
            (width / 3) * (index - horizontal) -
            offsetBarLength;
        return [x, y];
    } else {
        const y =
            (-1 / 2) * window.innerHeight - 10 - offsetBarLength;
        const x =
            (-1 / 2) * window.innerWidth +
            index * width +
            offsetBarLength +
            (width / 3) * index;
        return [x, y];
    }
}

export { chooseColor, pickColor, positions };
