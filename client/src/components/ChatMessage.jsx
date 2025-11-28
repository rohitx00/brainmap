import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
    const isUser = message.role === 'user';
    const isError = message.isError;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`flex items-start max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-sm">🤖</span>
                    </div>
                )}

                {/* Message Bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl ${isUser
                            ? 'bg-primary text-white rounded-tr-sm'
                            : isError
                                ? 'bg-red-900/30 border border-red-500/50 text-red-200 rounded-tl-sm'
                                : 'glass-card rounded-tl-sm'
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>

                    {/* Timestamp */}
                    <span className={`text-xs mt-1 block ${isUser ? 'text-white/70' : 'text-slate-500'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                        })}
                    </span>
                </div>

                {/* User Avatar */}
                {isUser && (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ml-2 flex-shrink-0">
                        <span className="text-sm">👤</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatMessage;
