// JS Implementation for Levenshtein
const levenshteinJS = (a, b) => {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }
    return matrix[b.length][a.length];
};

export const searchTopics = async (query, topics) => {
    return new Promise((resolve) => {
        if (!query || !topics || topics.length === 0) {
            resolve([]);
            return;
        }

        const results = topics.map(t => ({
            item: t,
            distance: levenshteinJS(query, t)
        }));

        // Threshold: Allow distance up to 3
        const filtered = results.filter(r => r.distance <= 3);

        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);

        resolve(filtered);
    });
};
