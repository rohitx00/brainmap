import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password_hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    xp: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    }
});

const User = mongoose.model('User', userSchema);

export default User;
