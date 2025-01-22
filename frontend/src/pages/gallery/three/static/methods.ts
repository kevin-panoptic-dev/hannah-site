function select(array: any[]) {
    if (!array.length) {
        return;
    }
    const item = array[Math.floor(Math.random() * array.length)];
    return item;
}

export { select };
