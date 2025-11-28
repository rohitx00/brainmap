import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sessionType, setSessionType] = useState('general');
    const [context, setContext] = useState({});
    const [remaining, setRemaining] = useState(20);
    const [limit, setLimit] = useState({ limit: 20, used: 0, remaining: 20 });

    // Fetch rate limit on mount
    useEffect(() => {
        if (user) {
            fetchRateLimit();
        }
    }, [user]);

    const fetchRateLimit = async () => {
        try {
            const response = await api.get('/api/tutor/limit');
            setLimit(response.data);
            setRemaining(response.data.remaining);
        } catch (error) {
            console.error('Failed to fetch rate limit:', error);
        }
    };

    const createSession = async (type = 'general', ctx = {}) => {
        try {
            setLoading(true);
            const response = await api.post('/api/tutor/session', {
                sessionType: type,
                context: ctx
            });

            setSessionId(response.data.sessionId);
            setSessionType(type);
            setContext(ctx);
            setMessages([{
                role: 'assistant',
                message: response.data.welcomeMessage,
                timestamp: new Date().toISOString()
            }]);
            setRemaining(response.data.remaining);

            return response.data.sessionId;
        } catch (error) {
            console.error('Failed to create session:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (text) => {
        if (!text.trim() || !sessionId) return;

        // Add user message immediately
        const userMessage = {
            role: 'user',
            message: text,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        try {
            setLoading(true);
            const response = await api.post('/api/tutor/message', {
                sessionId,
                message: text
            });

            // Add AI response
            const aiMessage = {
                role: 'assistant',
                message: response.data.message,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
            setRemaining(response.data.remaining);

            // Update rate limit
            await fetchRateLimit();

        } catch (error) {
            console.error('Failed to send message:', error);

            // Add error message
            const errorMessage = {
                role: 'assistant',
                message: error.response?.status === 429
                    ? '⚠️ You\'ve reached your daily message limit (20 messages). The limit will reset at midnight.'
                    : 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const openChat = async (type = 'general', ctx = {}) => {
        setIsOpen(true);

        // Create new session if none exists or type changed
        if (!sessionId || type !== sessionType) {
            await createSession(type, ctx);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const clearSession = async () => {
        if (sessionId) {
            try {
                await api.delete(`/api/tutor/session/${sessionId}`);
            } catch (error) {
                console.error('Failed to delete session:', error);
            }
        }

        setSessionId(null);
        setMessages([]);
        setSessionType('general');
        setContext({});

        // Create new session
        if (isOpen) {
            await createSession();
        }
    };

    const value = {
        isOpen,
        sessionId,
        messages,
        loading,
        sessionType,
        context,
        remaining,
        limit,
        openChat,
        closeChat,
        sendMessage,
        clearSession,
        fetchRateLimit
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
