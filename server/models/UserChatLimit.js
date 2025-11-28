import mongoose from 'mongoose';

const userChatLimitSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    messages_today: {
        type: Number,
        default: 0
    },
    last_reset: {
        type: String, // YYYY-MM-DD
        required: true
    }
});

const UserChatLimit = mongoose.model('UserChatLimit', userChatLimitSchema);

export default UserChatLimit;
