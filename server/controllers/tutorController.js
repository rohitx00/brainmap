import { getTutorResponse, getWelcomeMessage } from '../services/tutorService.js';
import UserChatLimit from '../models/UserChatLimit.js';
import ChatSession from '../models/ChatSession.js';

/**
 * Rate limiting configuration
 */
const DAILY_MESSAGE_LIMIT = 20;

/**
 * Check and update rate limit for user
 */
const checkRateLimit = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        let limit = await UserChatLimit.findOne({ user_id: userId });

        if (!limit) {
            // Create new record
            limit = new UserChatLimit({
                user_id: userId,
                messages_today: 1,
                last_reset: today
            });
            await limit.save();
            return { allowed: true, remaining: DAILY_MESSAGE_LIMIT - 1 };
        }

        // Check if we need to reset (new day)
        if (limit.last_reset !== today) {
            limit.messages_today = 1;
            limit.last_reset = today;
            await limit.save();
            return { allowed: true, remaining: DAILY_MESSAGE_LIMIT - 1 };
        }

        // Check if limit exceeded
        if (limit.messages_today >= DAILY_MESSAGE_LIMIT) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: new Date(today + 'T23:59:59').toISOString()
            };
        }

        // Increment counter
        limit.messages_today += 1;
        await limit.save();

        return {
            allowed: true,
            remaining: DAILY_MESSAGE_LIMIT - limit.messages_today
        };

    } catch (error) {
        console.error('Rate limit check error:', error);
        throw error;
    }
};

/**
 * Create a new chat session
 */
export const createSession = async (req, res) => {
    try {
        const { sessionType = 'general', context = {} } = req.body;

        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user.userId || req.user.id;

        const welcomeMsg = getWelcomeMessage(sessionType, context);

        const session = new ChatSession({
            user_id: userId,
            session_type: sessionType,
            context_data: JSON.stringify(context),
            messages: [{
                role: 'assistant',
                message: welcomeMsg
            }]
        });

        await session.save();

        // Get remaining messages
        const limit = await UserChatLimit.findOne({ user_id: userId });
        const messagesUsed = limit ? limit.messages_today : 0;
        const remaining = DAILY_MESSAGE_LIMIT - messagesUsed;

        res.json({
            sessionId: session._id,
            welcomeMessage: welcomeMsg,
            remaining
        });

    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create chat session', details: error.message });
    }
};

/**
 * Send a message and get AI response
 */
export const sendMessage = async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        const userId = req.user.userId || req.user.id;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message cannot be empty' });
        }

        // Check rate limit
        const rateLimit = await checkRateLimit(userId);
        if (!rateLimit.allowed) {
            return res.status(429).json({
                error: 'Daily message limit reached',
                remaining: 0,
                resetTime: rateLimit.resetTime
            });
        }

        // Verify session belongs to user
        const session = await ChatSession.findOne({ _id: sessionId, user_id: userId });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        // Get chat history for context (last 10 messages)
        // Mongoose stores messages in array, we can slice it or just map
        const chatHistory = session.messages.slice(-10).map(m => ({
            role: m.role,
            message: m.message
        }));

        // Save user message
        session.messages.push({ role: 'user', message });

        // Get AI response
        const context = session.context_data ? JSON.parse(session.context_data) : {};
        const aiResponse = await getTutorResponse(
            message,
            session.session_type,
            context,
            chatHistory
        );

        if (!aiResponse.success) {
            return res.status(500).json({ error: aiResponse.message });
        }

        // Save AI response
        session.messages.push({ role: 'assistant', message: aiResponse.message });
        session.updated_at = Date.now();
        await session.save();

        res.json({
            message: aiResponse.message,
            remaining: rateLimit.remaining
        });

    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
};

/**
 * Get chat session history
 */
export const getSessionHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId || req.user.id;

        const session = await ChatSession.findOne({ _id: sessionId, user_id: userId });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({
            session: {
                id: session._id,
                session_type: session.session_type,
                created_at: session.created_at,
                updated_at: session.updated_at
            },
            messages: session.messages
        });

    } catch (error) {
        console.error('Get session history error:', error);
        res.status(500).json({ error: 'Failed to retrieve session history' });
    }
};

/**
 * Get user's remaining message count
 */
export const getRemainingMessages = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const today = new Date().toISOString().split('T')[0];

        let limit = await UserChatLimit.findOne({ user_id: userId });
        let messagesUsed = 0;

        if (limit) {
            // Reset if it's a new day
            if (limit.last_reset !== today) {
                limit.messages_today = 0;
                limit.last_reset = today;
                await limit.save();
                messagesUsed = 0;
            } else {
                messagesUsed = limit.messages_today;
            }
        }

        const remaining = DAILY_MESSAGE_LIMIT - messagesUsed;

        res.json({
            limit: DAILY_MESSAGE_LIMIT,
            used: messagesUsed,
            remaining,
            resetsAt: new Date(today + 'T23:59:59').toISOString()
        });

    } catch (error) {
        console.error('Get remaining messages error:', error);
        res.status(500).json({ error: 'Failed to get message limit' });
    }
};

/**
 * Delete a chat session
 */
export const deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user.userId || req.user.id;

        const result = await ChatSession.deleteOne({ _id: sessionId, user_id: userId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Session not found' });
        }

        res.json({ message: 'Session deleted successfully' });

    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

/**
 * Get user's recent sessions
 */
export const getUserSessions = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;

        const sessions = await ChatSession.find({ user_id: userId })
            .sort({ updated_at: -1 })
            .limit(10)
            .select('session_type created_at updated_at messages');

        const formattedSessions = sessions.map(s => ({
            id: s._id,
            session_type: s.session_type,
            created_at: s.created_at,
            updated_at: s.updated_at,
            message_count: s.messages.length
        }));

        res.json({ sessions: formattedSessions });

    } catch (error) {
        console.error('Get user sessions error:', error);
        res.status(500).json({ error: 'Failed to retrieve sessions' });
    }
};
