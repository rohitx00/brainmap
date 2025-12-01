import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../utils/api';

const Quiz = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openChat } = useChat();
    const { topic, difficulty } = location.state || { topic: 'General', difficulty: 'Medium' };

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [loading, setLoading] = useState(true);

    // Data Fetching
    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await api.post('/api/generate', { topic, difficulty });
                const fetchedQuestions = response.data.questions || [];

                const formattedQuestions = fetchedQuestions.map((q, i) => ({
                    ...q,
                    id: i,
                    options: q.options || []
                }));

                setQuestions(formattedQuestions);
            } catch (error) {
                console.error("Failed to generate quiz:", error);
                alert("Failed to generate quiz. Please try again.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [topic, difficulty, navigate]);

    // Timer
    useEffect(() => {
        if (loading || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [loading, timeLeft]);

    const handleAnswer = (option) => {
        setAnswers({ ...answers, [currentQuestion]: option });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        navigate('/result', {
            state: {
                answers,
                questions,
                timeTaken: 300 - timeLeft,
                userId: user?.userId,
                topic,
                difficulty
            }
        });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAskTutor = () => {
        openChat('quiz', {
            topic,
            difficulty,
            question: questions[currentQuestion].question,
            options: questions[currentQuestion].options
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold">Generating Quiz...</h2>
                    <p className="text-slate-500 dark:text-slate-400">Crafting questions on {topic}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 pt-24 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold">{topic}</h2>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{difficulty} Mode</span>
                </div>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5 text-accent mr-2" />
                    <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-slate-700 dark:text-white'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-8 md:p-12"
                >
                    <span className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider mb-4 block">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-8">
                        {questions[currentQuestion].question}
                    </h3>

                    <div className="grid gap-4">
                        {questions[currentQuestion].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option)}
                                className={`p-4 rounded-xl text-left transition-all border-2 ${answers[currentQuestion] === option
                                    ? 'border-primary bg-primary/10 text-white'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 bg-white/50 dark:bg-slate-800/50'
                                    }`}
                            >
                                <span className="inline-block w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-center leading-8 mr-4 text-sm">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Ask Tutor Button */}
                    <button
                        onClick={handleAskTutor}
                        className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Need a hint? Ask the AI Tutor
                    </button>
                </motion.div>
            </AnimatePresence>

            {/* Footer Controls */}
            <div className="flex justify-end mt-8">
                <button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion]}
                    className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-full hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;
