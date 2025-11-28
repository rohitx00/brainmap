import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import ChatInterface from './ChatInterface';

const FloatingChatButton = () => {
    const { isOpen, openChat, messages } = useChat();
    const [showPulse, setShowPulse] = useState(true);

    // Hide pulse after first interaction
    useEffect(() => {
        if (messages.length > 1) {
            setShowPulse(false);
        }
    }, [messages]);

    const handleClick = () => {
        if (!isOpen) {
            openChat('general', {});
        }
    };

    return (
        <>
            {/* Chat Interface */}
            <ChatInterface />

            {/* Floating Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleClick}
                        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full shadow-lg flex items-center justify-center z-50 transition-shadow"
                    >


                        {/* Icon */}
                        <div className="relative">
                            <MessageCircle className="w-7 h-7 text-white" />

                            {/* Sparkle badge */}
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 3
                                }}
                                className="absolute -top-1 -right-1"
                            >
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                            </motion.div>
                        </div>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
};

export default FloatingChatButton;
