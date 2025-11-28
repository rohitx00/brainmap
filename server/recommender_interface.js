export const getRecommendation = async (attempts) => {
    return new Promise((resolve) => {
        if (!attempts || attempts.length === 0) {
            resolve({ recommendation: "General Knowledge", reason: "Start your first quiz!" });
            return;
        }

        const topicStats = {};
        attempts.forEach((a, index) => {
            if (!topicStats[a.topic]) {
                topicStats[a.topic] = { totalScore: 0, count: 0, lastSeen: index };
            }
            const percentage = (a.score / a.total_questions) * 100;
            topicStats[a.topic].totalScore += percentage;
            topicStats[a.topic].count++;
            topicStats[a.topic].lastSeen = index; // Higher index = more recent
        });

        let bestTopic = "";
        let maxWeight = -1.0;
        const totalAttempts = attempts.length;

        for (const topic in topicStats) {
            const avgScore = topicStats[topic].totalScore / topicStats[topic].count;

            // Weight formula from C module:
            // Score component: Lower score -> Higher weight (0 to 100)
            const scoreWeight = 100.0 - avgScore;

            // Recency component: Lower index (older) -> Higher weight
            // recency_weight = (total_attempts - last_seen_index)
            const recencyWeight = totalAttempts - topicStats[topic].lastSeen;

            // Combine: 70% based on score, 30% based on recency (scaled by 2.0 as per C code)
            const finalWeight = (scoreWeight * 0.7) + (recencyWeight * 2.0);

            if (finalWeight > maxWeight) {
                maxWeight = finalWeight;
                bestTopic = topic;
            }
        }

        if (bestTopic) {
            resolve({
                recommendation: bestTopic,
                reason: "Based on your performance and recency."
            });
        } else {
            resolve({
                recommendation: "General Knowledge",
                reason: "Start your journey!"
            });
        }
    });
};
