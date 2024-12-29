/*
Substitution: [i-1][j-1]: the cost of previous i - 1 characters to match the previous j - 1 characters;
Insertion: [i][j-1]: the cost of transforming previous i - 1 characters to match the previous j - 1 characters, then insert a new characters (current) from air and + 1.
Deletion: [i-1][j]: the cost of transforming the previous i - 1 characters to match the previous j characters, then + 1 to imitate the cost of deletion.
*/

/**
 * Calculates the Levenshtein distance between two strings.
 * The Levenshtein distance is the minimum number of single-character edits
 * (insertions, deletions, or substitutions) required to change one string into another.
 *
 * @param source - The source string to compare from
 * @param target - The target string to compare to
 * @returns The Levenshtein distance between the two strings
 * @throws {Error} If either input is null or undefined
 *
 * Time Complexity: O(m*n) where m and n are the lengths of the strings
 * Space Complexity: O(m*n)
 */
function levenshteinDistance(source: string, target: string): number {
    if (source == null || target == null) {
        throw new Error("Input strings cannot be null or undefined");
    }

    if (source === target) return 0;
    if (source.length === 0) return target.length;
    if (target.length === 0) return source.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= source.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 1; j <= target.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= source.length; i++) {
        for (let j = 1; j <= target.length; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[source.length][target.length];
}

/**
 * Calculates the similarity between two strings using Levenshtein distance.
 * Returns a normalized score between 0 and 1, where 1 means exact match.
 *
 * @param input - The input string to compare
 * @param keyword - The keyword to compare against
 * @returns A similarity score between 0 and 1
 * @throws {Error} If either input is null, undefined, or empty
 */
function match(input: string, keyword: string): number {
    if (!input || !keyword) {
        throw new Error("Input and keyword must not be empty");
    }

    const distance = levenshteinDistance(input.toLowerCase(), keyword.toLowerCase());
    const maxLength = Math.max(input.length, keyword.length);

    // Normalize the score between 0 and 1
    return Number((1 - distance / maxLength).toFixed(2));
}

export default match;
