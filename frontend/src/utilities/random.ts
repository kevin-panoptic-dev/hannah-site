/**
 * Generates an array of random percentage values between 50 and 90.
 *
 * @param count - The number of random percentages to generate
 * @returns Array of random percentage numbers
 * @throws {Error} If count is negative or not a number
 */
function generatePercentages(count: number): string[] {
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("Count must be a non-negative integer");
    }

    const MIN_PERCENTAGE = 50;
    const RANGE = 40;

    return Array.from({ length: count }, () => {
        // Generate a number between 50 and 90 with one decimal place
        return Number((MIN_PERCENTAGE + Math.random() * RANGE).toFixed(1)).toString();
    });
}

/**
 * Generates an array of random dates within a specified range.
 *
 * @param count - The number of dates to generate
 * @param options - Optional configuration for date generation
 * @returns Array of formatted date strings
 * @throws {Error} If count is negative or not a number
 */
function generateRandomDates(
    count: number,
    options: {
        startYear?: number;
        endYear?: number;
        format?: "MM-DD-YYYY" | "YYYY-MM-DD";
    } = {}
): string[] {
    if (!Number.isInteger(count) || count < 0) {
        throw new Error("Count must be a non-negative integer");
    }

    const { startYear = 2022, endYear = 2027, format = "MM-DD-YYYY" } = options;

    return Array.from({ length: count }, () => {
        const year = Math.floor(Math.random() * (endYear - startYear + 1) + startYear);
        const month = Math.floor(Math.random() * 12 + 1);
        const maxDaysInMonth = new Date(year, month, 0).getDate();
        const day = Math.floor(Math.random() * maxDaysInMonth + 1);

        // Pad numbers with leading zeros
        const monthStr = month.toString().padStart(2, "0");
        const dayStr = day.toString().padStart(2, "0");

        return format === "MM-DD-YYYY"
            ? `${monthStr}-${dayStr}-${year}`
            : `${year}-${monthStr}-${dayStr}`;
    });
}

export { generatePercentages, generateRandomDates };
