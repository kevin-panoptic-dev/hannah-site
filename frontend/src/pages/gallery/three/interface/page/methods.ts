function select(array: any[]): any {
    if (!array.length) {
        throw new Error("Cannot select item from an empty array.");
    }
    const item = array[Math.floor(Math.random() * array.length)];
    return item;
}

function tilt(): number {
    const min = -Math.PI / 6;
    const max = Math.PI / 6;
    return Math.random() * (max - min) + min;
}

function println(object: any, threshold: number = 0.995): void {
    if (Math.random() >= threshold) {
        console.info(object);
    }
}

function getPlanet(
    pool: string[],
    required: number
): [string, string, string][] {
    if (pool.length <= required)
        throw new Error("Not enough items in the pool for select");

    const keys: string[] = [];
    const result: [string, string, string][] = [];

    for (let _ = 0; _ <= required; _++) {
        let selectedKey: string;
        while (true) {
            const key = select(pool);
            if (!keys.includes(key)) {
                selectedKey = key;
                break;
            }
        }
        keys.push(selectedKey);

        result.push([
            `./planet${selectedKey}main`,
            `./planet${selectedKey}color`,
            `./planet${selectedKey}normal`,
        ]);
    }

    return result;
}

export { select, tilt, println, getPlanet };
