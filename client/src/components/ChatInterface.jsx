import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatInterface = () => {
    const { isOpen, closeChat, messages, loading, sendMessage, clearSession, remaining, sessionType, context } = useChat();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed bottom-0 right-0 w-full h-full md:bottom-24 md:right-6 md:w-[400px] md:h-[600px] bg-white/95 dark:bg-slate-900/95 md:glass-card rounded-none md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
                style={{
                    maxHeight: '100vh' // Default for mobile
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-white" />
                        <div>
                            <h3 className="font-bold text-white">AI Tutor</h3>
                            <p className="text-xs text-white/80">
                                {sessionType === 'quiz' ? `Quiz Mode: ${context.topic || 'Quiz'}` : 'General Study Help'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={clearSession}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            title="Clear conversation"
                        >
                            <Trash2 className="w-4 h-4 text-white" />
                        </button>
                        <button
                            onClick={closeChat}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Rate Limit Indicator */}
                <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Messages remaining today:</span>
                    <span className={`text-xs font-bold ${remaining <= 5 ? 'text-yellow-400' : remaining === 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                        {remaining} / 20
                    </span>
                </div>

                {/* Messages Area */}
                <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    style={{
                        scrollBehavior: 'smooth'
                    }}
                >
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-slate-500 text-sm text-center">
                            <div>
                                <Sparkles className="w-12 h-12 mx-auto mb-2 text-primary" />
                                <p>Start a conversation with your AI tutor!</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} message={msg} />
                            ))}

                            {/* Typing indicator */}
                            {loading && (
                                <div className="flex items-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2">
                                        <span className="text-sm">🤖</span>
                                    </div>
                                    <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Input Area */}
                <ChatInput
                    onSend={sendMessage}
                    disabled={loading}
                    remaining={remaining}
                    initialValue={context?.question ? `Explain this question: "${context.question}"` : ''}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ChatInterface;
