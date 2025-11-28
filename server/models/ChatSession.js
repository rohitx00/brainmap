import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    session_type: {
        type: String,
        default: 'general'
    },
    context_data: {
        type: String, // Storing as JSON string to match previous behavior, or could be Object
        default: '{}'
    },
    messages: [messageSchema],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
