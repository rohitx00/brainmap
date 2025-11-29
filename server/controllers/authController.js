import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
