import mongoose from 'mongoose';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import { checkAndAwardBadges, getLeaderboard } from '../controllers/gamificationController.js';
import connectDB from '../db.js';

const verify = async () => {
    try {
        await connectDB();
        console.log('Connected to DB via shared module');

        // 1. Create Test User
        const testUsername = `test_gamer_${Date.now()}`;
        const user = new User({
            username: testUsername,
            email: `${testUsername}@example.com`,
            password_hash: 'hash'
        });
        await user.save();
        console.log(`Created user: ${testUsername} (XP: ${user.xp})`);

        // 2. Simulate Quiz Attempt (Perfect Score)
        const attempt = new Attempt({
            user_id: user._id,
            topic: 'Test Topic',
            difficulty: 'Medium',
            score: 5,
            total_questions: 5,
            time_taken: 60
        });
        await attempt.save();

        // 3. Award Badges
        const result = await checkAndAwardBadges(user._id, attempt);
        console.log('Gamification Result:', result);

        // 4. Verify User Stats
        const updatedUser = await User.findById(user._id);
        console.log(`Updated User: XP=${updatedUser.xp}, Badges=${updatedUser.badges}`);

        if (updatedUser.xp === 60 && updatedUser.badges.includes('Gold Aim')) {
            console.log('✅ XP and Badge awarded correctly!');
        } else {
            console.error('❌ XP or Badge mismatch!');
        }

        // 5. Verify Leaderboard
        // Mock req/res for getLeaderboard
        const req = { query: { page: 1, limit: 10 } };
        const res = {
            json: (data) => {
                console.log('Leaderboard Data:', data.users.map(u => `${u.username}: ${u.xp}`));
                const found = data.users.find(u => u.username === testUsername);
                if (found) {
                    console.log('✅ User found in leaderboard!');
                } else {
                    console.error('❌ User NOT found in leaderboard!');
                }
            },
            status: (code) => ({ json: (data) => console.error(`Error ${code}:`, data) })
        };

        await getLeaderboard(req, res);

        // Cleanup
        await User.deleteOne({ _id: user._id });
        await Attempt.deleteOne({ _id: attempt._id });
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Verification failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    } finally {
        // mongoose.disconnect(); // connectDB might keep it open, but we should close it to exit
        // But connectDB doesn't return the connection object easily to close it if it's global mongoose.
        // mongoose.disconnect() works on the default connection.
        await mongoose.disconnect();
    }
};

verify();
