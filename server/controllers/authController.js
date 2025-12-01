import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password_hash: hashedPassword
        });

        await user.save();

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
        res.status(201).json({
            message: 'User created successfully',
            token,
            username: user.username,
            userId: user._id
        });
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Username or email already exists' });
        } else {
            res.status(500).json({ error: 'Error creating user' });
        }
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        if (await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET);
            res.json({ token, username: user.username, userId: user._id });
        } else {
            res.status(403).json({ error: 'Invalid password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password_hash');
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Aggregate stats
        const attempts = await Attempt.find({ user_id: userId });
        const totalQuizzes = attempts.length;
        const totalTimeSpent = attempts.reduce((acc, curr) => acc + curr.time_taken, 0);
        const avgScore = totalQuizzes > 0
            ? (attempts.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) / totalQuizzes).toFixed(1)
            : 0;

        res.json({
            user,
            stats: {
                totalQuizzes,
                totalTimeSpent,
                avgScore
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email } = req.body;

        // Check if username/email already exists for other users
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { username, email },
            { new: true }
        ).select('-password_hash');

        res.json({ user, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password_hash = hashedPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};
