export const gradeQuiz = async (questions, answers, timeTaken) => {
    return new Promise((resolve) => {
        let score = 0;
        let correctCount = 0;
        const totalQuestions = questions.length;

        questions.forEach(q => {
            if (answers[q.id] === q.answer) {
                score++;
                correctCount++;
            }
        });

        // Analytics
        const efficiency = timeTaken > 0 ? score / timeTaken : 0.0;
        
        let summary = "";
        if (score === totalQuestions) {
            summary = "Perfect Score! Outstanding performance.";
        } else if (score > totalQuestions / 2) {
            summary = "Good job! Keep practicing.";
        } else {
            summary = "Needs improvement. Don't give up!";
        }

        resolve({
            score: score,
            efficiency: parseFloat(efficiency.toFixed(4)),
            summary: summary
        });
    });
};
