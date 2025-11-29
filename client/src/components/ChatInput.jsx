import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend, disabled, remaining, initialValue = '' }) => {
    const [input, setInput] = useState(initialValue);

    // Update input when initialValue changes
    React.useEffect(() => {
        if (initialValue) {
            setInput(initialValue);
        }
    }, [initialValue]);
    const maxLength = 500;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const isLowOnMessages = remaining <= 5 && remaining > 0;
    const isOutOfMessages = remaining === 0;

    return (
        <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4 bg-slate-900/50">
            {/* Rate limit warning */}
            {isLowOnMessages && (
                <div className="mb-2 text-xs text-yellow-400 flex items-center">
                    ⚠️ Only {remaining} messages remaining today
                </div>
            )}
            {isOutOfMessages && (
                <div className="mb-2 text-xs text-red-400 flex items-center">
                    ❌ Daily limit reached. Resets at midnight.
                </div>
            )}

            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
                        onKeyDown={handleKeyDown}
                        placeholder={isOutOfMessages ? "Daily limit reached..." : "Ask me anything..."}
                        disabled={disabled || isOutOfMessages}
                        rows={1}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-16 text-sm resize-none focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            minHeight: '44px',
                            maxHeight: '120px',
                            height: 'auto'
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                    />

                    {/* Character count */}
                    <span className="absolute bottom-2 right-2 text-xs text-slate-500">
                        {input.length}/{maxLength}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={!input.trim() || disabled || isOutOfMessages}
                    className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-2 text-xs text-slate-500">
                Press Enter to send, Shift+Enter for new line
            </div>
        </form>
    );
};

export default ChatInput;
