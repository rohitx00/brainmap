import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({}, 'username xp badges')
            .sort({ xp: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Server error fetching leaderboard' });
    }
};

export const checkAndAwardBadges = async (userId, attempt) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // Calculate XP
        // Base XP: 10 per question
        // Accuracy Bonus: score * 2
        const baseXP = attempt.total_questions * 10;
        const accuracyBonus = attempt.score * 2;
        const totalXP = baseXP + accuracyBonus;

        user.xp += totalXP;

        // Calculate Accuracy Percentage
        const accuracy = (attempt.score / attempt.total_questions) * 100;
        let newBadge = null;

        if (accuracy === 100) {
            newBadge = 'Gold Aim';
        } else if (accuracy >= 80) {
            newBadge = 'Silver Aim';
        } else if (accuracy >= 60) {
            newBadge = 'Bronze Aim';
        }

        if (newBadge && !user.badges.includes(newBadge)) {
            user.badges.push(newBadge);
        }

        await user.save();
        return { xpGained: totalXP, newBadge };
    } catch (error) {
        console.error('Error awarding badges:', error);
    }
};

export const getUserStats = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId, 'xp badges');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ message: 'Server error fetching user stats' });
    }
};
