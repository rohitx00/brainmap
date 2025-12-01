import mongoose from 'mongoose';
import User from '../models/User.js';
import Attempt from '../models/Attempt.js';
import { getProfile } from '../controllers/authController.js';
import connectDB from '../db.js';

const verify = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // 1. Create Test User
        const testUsername = `profile_test_${Date.now()}`;
        const user = new User({
            username: testUsername,
            email: `${testUsername}@example.com`,
            password_hash: 'hash'
        });
        await user.save();
        console.log(`Created user: ${user._id}`);

        // 2. Mock Req/Res
        const req = {
            params: { userId: user._id },
            user: { userId: user._id } // Mock auth middleware
        };
        const res = {
            json: (data) => {
                console.log('Profile Data:', JSON.stringify(data, null, 2));
                if (data.user.username === testUsername && data.stats) {
                    console.log('✅ Profile fetched successfully!');
                } else {
                    console.error('❌ Profile data mismatch!');
                }
            },
            status: (code) => ({
                json: (data) => console.error(`Error ${code}:`, data)
            })
        };

        // 3. Call Controller
        await getProfile(req, res);

        // Cleanup
        await User.deleteOne({ _id: user._id });
        console.log('Cleanup done.');

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.disconnect();
    }
};

verify();
