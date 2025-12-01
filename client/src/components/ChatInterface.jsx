import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Sparkles, LogIn } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatInterface = () => {
    const { isOpen, closeChat, messages, loading, sendMessage, clearSession, remaining, sessionType, context } = useChat();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for click-outside to close */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeChat}
                        className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="fixed top-20 bottom-0 right-0 w-full md:top-auto md:bottom-6 md:right-6 md:w-[400px] md:h-[600px] bg-white/95 dark:bg-slate-900/95 md:glass-card rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
                        style={{
                            maxHeight: 'calc(100vh - 80px)' // Ensure it doesn't exceed screen height minus navbar
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center justify-between shrink-0">
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
                        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between shrink-0">
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
                            {!user ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                        <LogIn className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                                        Please log in to chat with your AI Tutor and save your progress.
                                    </p>
                                    <button
                                        onClick={() => {
                                            closeChat();
                                            navigate('/login');
                                        }}
                                        className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-primary/25"
                                    >
                                        Log In Now
                                    </button>
                                </div>
                            ) : messages.length === 0 ? (
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

                        {/* Input Area - Only show if logged in */}
                        {user && (
                            <ChatInput
                                onSend={sendMessage}
                                disabled={loading}
                                remaining={remaining}
                                initialValue={context?.question ? `Explain this question: "${context.question}"` : ''}
                            />
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ChatInterface;
