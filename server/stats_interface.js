export const calculateStats = async (attempts) => {
    return new Promise((resolve) => {
        let totalScore = 0;
        let totalQuestionsAll = 0;
        let totalTime = 0;
        const count = attempts.length;

        attempts.forEach(a => {
            totalScore += a.score;
            totalQuestionsAll += a.total_questions;
            totalTime += (a.time_taken || 0);
        });

        const averageScore = totalQuestionsAll > 0 ? (totalScore / totalQuestionsAll) * 100.0 : 0.0;

        resolve({
            totalQuizzes: count,
            totalTimeSpent: totalTime,
            averageScore: parseFloat(averageScore.toFixed(2))
        });
    });
};
