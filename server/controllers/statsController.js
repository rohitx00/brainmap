import User from '../models/User.js';
import Attempt from '../models/Attempt.js';

export const getGlobalStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();

        const attempts = await Attempt.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuestions: { $sum: "$total_questions" }
                }
            }
        ]);

        const questionsSolved = attempts.length > 0 ? attempts[0].totalQuestions : 0;

        res.status(200).json({
            users: usersCount,
            questionsSolved: questionsSolved
        });
    } catch (error) {
        console.error('Error fetching global stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
