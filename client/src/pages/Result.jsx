import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Download, Home, RefreshCw, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../utils/api';

const Result = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { openChat } = useChat();
    const { answers, questions, timeTaken, topic, difficulty } = location.state || { answers: {}, questions: [], timeTaken: 0, topic: 'General', difficulty: 'Medium' };

    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        const submitQuiz = async () => {
            if (!questions.length || !user || hasSubmitted.current) {
                setLoading(false);
                return;
            }

            hasSubmitted.current = true;

            try {
                const response = await api.post('/api/submit', {
                    userId: user.userId,
                    topic,
                    difficulty,
                    answers,
                    questions,
                    timeTaken
                });
                setResultData(response.data);
            } catch (err) {
                console.error("Submission failed:", err);
                setError("Failed to submit quiz results.");
            } finally {
                setLoading(false);
            }
        };

        submitQuiz();
    }, [questions, answers, timeTaken, user, topic, difficulty]);

    const handleDownloadReport = async () => {
        if (!resultData?.attemptId) return;
        try {
            const response = await api.get(`/api/report/${resultData.attemptId}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${resultData.attemptId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Failed to download report.");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-24">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold">Calculating Results...</h2>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center pt-24">
            <div className="text-red-500 text-xl font-bold">{error}</div>
            <Link to="/dashboard" className="ml-4 text-primary hover:underline">Return to Dashboard</Link>
        </div>
    );

    const percentage = resultData && questions.length > 0 ? Math.round((resultData.score / questions.length) * 100) : 0;
    // Fallback score calculation if API fails but we want to show something (optional)
    const localScore = questions.reduce((acc, q, idx) => {
        return acc + (answers[idx] === q.answer ? 1 : 0);
    }, 0);


    return (
        <div className="container mx-auto px-6 py-12 pt-24 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold mb-4">Quiz Complete!</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">{topic}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{difficulty} Level</p>
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-primary mb-6 relative">
                    <span className="text-4xl font-bold">{percentage}%</span>
                    <span className="absolute -bottom-2 bg-primary px-3 py-1 rounded-full text-xs font-bold">Score</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                    {resultData?.summary || `You completed the quiz in ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s.`}
                </p>
            </motion.div>

            <div className="grid gap-6 mb-12">
                {questions.map((q, idx) => {
                    const userAnswer = answers[idx];
                    const isCorrect = userAnswer === q.answer;

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`glass-card p-6 border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold">{q.question}</h3>
                                {isCorrect ? (
                                    <CheckCircle className="text-green-500 w-6 h-6 flex-shrink-0" />
                                ) : (
                                    <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'}`}>
                                    <span className="font-bold block mb-1">Your Answer:</span>
                                    {userAnswer || "Skipped"}
                                </div>

                                {!isCorrect && (
                                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                        <span className="font-bold block mb-1">Correct Answer:</span>
                                        {q.answer}
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <span className="font-bold text-primary">Explanation:</span> {q.explanation || "Explanation available in full report."}
                                    </div>
                                    <button
                                        onClick={() => openChat('quiz', {
                                            topic,
                                            question: q.question,
                                            userAnswer,
                                            correctAnswer: q.answer,
                                            options: q.options,
                                            isExplanation: true
                                        })}
                                        className="ml-4 flex items-center gap-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 border border-primary/50 rounded-lg text-xs text-primary transition-colors flex-shrink-0"
                                    >
                                        <MessageCircle className="w-3 h-3" />
                                        Explain
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                <Link to="/dashboard" className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-semibold flex items-center transition-colors">
                    <Home className="mr-2 w-5 h-5" /> Dashboard
                </Link>
                <Link to="/dashboard" className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold flex items-center transition-colors">
                    <RefreshCw className="mr-2 w-5 h-5" /> Try Another Topic
                </Link>
                <button onClick={handleDownloadReport} disabled={!resultData?.attemptId} className="px-6 py-3 bg-accent/20 text-accent hover:bg-accent/30 rounded-xl font-semibold flex items-center transition-colors disabled:opacity-50">
                    <Download className="mr-2 w-5 h-5" /> Download Report
                </button>
            </div>
        </div>
    );
};

export default Result;
