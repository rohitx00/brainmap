import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, Award, BarChart2, Play, List, Plus, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import api from '../utils/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
                <p className="text-slate-300 font-bold mb-1">{label}</p>
                <p className="text-xs text-slate-400 mb-2">{payload[0].payload.date}</p>
                <p className="text-primary font-semibold">{payload[0].payload.topic}</p>
                <p className="text-white">Score: {payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { openChat } = useChat();
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ totalQuizzes: 0, totalTimeSpent: 0, averageScore: 0 });
    const [gamificationStats, setGamificationStats] = useState({ xp: 0, badges: [] });
    const [recommendation, setRecommendation] = useState({ recommendation: '', reason: '' });
    const [dueReviews, setDueReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [studyQueue, setStudyQueue] = useState([]);
    const [newQueueTopic, setNewQueueTopic] = useState('');

    const [history, setHistory] = useState([]);

    // Calculate stats from history
    // Stats are now fetched from the backend
    const { totalQuizzes, totalTimeSpent, averageScore } = stats;

    // Format time spent in hours and minutes
    const formatTimeSpent = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return minutes > 0 ? `${hours}.${Math.floor(minutes / 6)}h` : `${hours}h`;
        }
        return `${minutes}m`;
    };

    // Prepare data for performance chart
    const performanceData = history
        .slice()
        .reverse() // Show oldest to newest
        .map((attempt, index) => ({
            name: `Quiz ${index + 1}`,
            date: new Date(attempt.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: Math.round((attempt.score / attempt.total_questions) * 100),
            topic: attempt.topic
        }))
        .slice(-10); // Show last 10 quizzes

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchHistory = async () => {
            try {
                const endpoint = searchQuery
                    ? `/api/search/${user.userId}?query=${searchQuery}`
                    : `/api/history/${user.userId}`;
                const response = await api.get(endpoint);
                setHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await api.get(`/api/stats/${user.userId}`);
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };

        const fetchRecommendation = async () => {
            try {
                const response = await api.get(`/api/recommendation/${user.userId}`);
                setRecommendation(response.data);
            } catch (error) {
                console.error('Failed to fetch recommendation:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await api.get(`/api/reviews/${user.userId}`);
                setDueReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        const fetchQueue = async () => {
            try {
                // We can use the same endpoint with a 'get' operation or just fetch it if we had a GET route.
                // Since we only implemented POST /api/study-plan, we might need to initialize it differently 
                // or just rely on the user adding something. 
                // Ideally, we should have a GET endpoint or use the POST with a no-op.
                // For now, let's assume it starts empty or we can add a 'fetch' op.
                // Actually, let's just leave it empty initially or fetch if we add that capability.
                // Wait, the previous code didn't fetch it on mount? 
                // Ah, the C module is persistent in memory but not across server restarts unless saved.
                // Let's add a 'fetch' operation to the interface if needed, but for now let's just stick to the current plan.
            } catch (error) {
                console.error('Failed to fetch queue:', error);
            }
        };

        const fetchGamificationStats = async () => {
            try {
                const response = await api.get(`/api/gamification/user/${user.userId}`);
                setGamificationStats(response.data);
            } catch (error) {
                console.error('Failed to fetch gamification stats:', error);
            }
        };

        fetchHistory();
        fetchStats();
        fetchRecommendation();
        fetchReviews();
        fetchGamificationStats();
    }, [user, navigate, searchQuery]);

    const handleStartQuiz = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;
        navigate('/quiz', { state: { topic, difficulty } });
    };

    const handleAddToQueue = async (e) => {
        e.preventDefault();
        if (!newQueueTopic.trim()) return;
        try {
            const response = await api.post('/api/study-plan', {
                currentQueue: studyQueue,
                operation: 'enqueue',
                topic: newQueueTopic
            });
            setStudyQueue(response.data);
            setNewQueueTopic('');
        } catch (error) {
            console.error('Failed to add to queue:', error);
        }
    };

    const handleStartNextSession = async () => {
        if (studyQueue.length === 0) return;
        const nextTopic = studyQueue[0];

        try {
            // Remove from queue
            const response = await api.post('/api/study-plan', {
                currentQueue: studyQueue,
                operation: 'dequeue'
            });
            setStudyQueue(response.data);

            // Open Chat
            openChat('tutor', { topic: nextTopic });
        } catch (error) {
            console.error('Failed to dequeue:', error);
        }
    };

    const handleRemoveFromQueue = async (topicToRemove) => {
        try {
            const response = await api.post('/api/study-plan', {
                currentQueue: studyQueue,
                operation: 'remove',
                topic: topicToRemove
            });
            setStudyQueue(response.data);
        } catch (error) {
            console.error('Failed to remove from queue:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 pt-20 md:pt-24">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                {/* Left Column: Start Quiz */}
                <div className="lg:col-span-2 space-y-8 min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <h2 className="text-3xl font-bold mb-6 flex items-center">
                            <Play className="w-8 h-8 text-primary mr-3" /> Start New Quiz
                        </h2>
                        <form onSubmit={handleStartQuiz} className="space-y-6">
                            <div>
                                <label className="block text-slate-400 mb-2">What do you want to learn?</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="e.g. Python, World History, Quantum Physics..."
                                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-400 mb-2">Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Easy', 'Medium', 'Hard'].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setDifficulty(level)}
                                            className={`py-3 rounded-xl font-medium transition-all ${difficulty === level
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-lg shadow-lg hover:shadow-primary/25 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Quiz
                            </button>
                        </form>
                    </motion.div>

                    {/* Study Plan Queue */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8"
                    >
                        <h2 className="text-2xl font-bold mb-6 flex items-center">
                            <List className="w-6 h-6 text-primary mr-3" />Quick Study Plan
                        </h2>

                        <div className="flex gap-4 mb-6">
                            <input
                                type="text"
                                value={newQueueTopic}
                                onChange={(e) => setNewQueueTopic(e.target.value)}
                                placeholder="Add topic to plan..."
                                className="flex-1 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white placeholder:text-slate-400 min-w-0"
                            />
                            <button
                                onClick={handleAddToQueue}
                                className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors text-slate-700 dark:text-white shrink-0"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {studyQueue.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-xl gap-4">
                                    <div className="min-w-0 flex-1">
                                        <span className="text-xs text-primary font-bold uppercase tracking-wider">Up Next</span>
                                        <h3 className="text-xl font-bold truncate">{studyQueue[0]}</h3>
                                    </div>
                                    <button
                                        onClick={handleStartNextSession}
                                        className="bg-primary hover:bg-primary-dark px-6 py-2 rounded-lg font-bold transition-colors flex items-center shrink-0 w-full sm:w-auto justify-center"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" /> Start Chat
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {studyQueue.slice(1).map((item, index) => (
                                        <div key={index} className="flex items-center justify-between text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-800/30 p-3 rounded-lg group">
                                            <div className="flex items-center min-w-0 flex-1 mr-4">
                                                <span className="w-6 text-center text-slate-600 font-mono shrink-0">{index + 2}</span>
                                                <span className="ml-3 truncate">{item}</span>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromQueue(item)}
                                                className="text-slate-600 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shrink-0"
                                                title="Remove from plan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 py-8">
                                Your study plan is empty. Add topics to create a queue!
                            </div>
                        )}
                    </motion.div>

                    {/* Performance Graph */}
                    {history.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-xl font-bold mb-6 flex items-center">
                                <BarChart2 className="w-6 h-6 text-primary mr-2" /> Performance Over Time
                            </h3>
                            <div className="w-full h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#94a3b8"
                                            style={{ fontSize: '12px' }}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            style={{ fontSize: '12px' }}
                                            domain={[0, 100]}
                                            ticks={[0, 25, 50, 75, 100]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#8b5cf6"
                                            strokeWidth={3}
                                            dot={{ fill: '#8b5cf6', r: 5 }}
                                            activeDot={{ r: 7 }}
                                            label={{ position: 'top', fill: '#94a3b8', fontSize: 12 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-4 text-slate-700 dark:text-slate-300">Recent Activity</h3>
                        <div className="space-y-4">
                            {history.length === 0 ? (
                                <div className="text-slate-500 text-center py-8">No quizzes taken yet. Start one above!</div>
                            ) : (
                                history.map((attempt) => (
                                    <div key={attempt.id} className="glass-card p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                        <div className="flex items-center min-w-0 flex-1 mr-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-4 shrink-0">
                                                <Clock className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold truncate">{attempt.topic}</h4>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(attempt.timestamp).toLocaleDateString()} • {attempt.difficulty}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="block text-green-400 font-bold">
                                                {Math.round((attempt.score / attempt.total_questions) * 100)}%
                                            </span>
                                            <span className="text-xs text-slate-500">Score</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Stats */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center">
                            <BarChart2 className="w-6 h-6 text-accent mr-2" /> Your Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold">{totalQuizzes}</div>
                                <div className="text-xs text-slate-400">Quizzes Attended</div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl text-center">
                                <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold">{averageScore}%</div>
                                <div className="text-xs text-slate-400">Average Score</div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl text-center col-span-2">
                                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <div className="text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</div>
                                <div className="text-2xl font-bold">{formatTimeSpent(totalTimeSpent)}</div>
                                <div className="text-xs text-slate-400">Time Spent</div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl text-center col-span-2 mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-left">
                                        <div className="text-xs text-slate-400">Total XP</div>
                                        <div className="text-xl font-bold text-indigo-500">{gamificationStats.xp}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-400">Badges</div>
                                        <div className="text-xl font-bold text-yellow-500">{gamificationStats.badges.length}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {gamificationStats.badges.map((badge, i) => (
                                        <span key={i} className="bg-yellow-100 text-yellow-800 text-[10px] font-medium px-2 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-300">
                                            {badge}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 bg-gradient-to-br from-primary/20 to-purple-900/20 border-primary/20"
                    >
                        <h3 className="font-bold mb-2">Pro Tip</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {recommendation.recommendation ? (
                                <>
                                    We recommend you try a quiz on <span className="text-primary font-bold">{recommendation.recommendation}</span>.
                                    <br />
                                    <span className="text-xs text-slate-400 italic">{recommendation.reason}</span>
                                </>
                            ) : (
                                "Take more quizzes to get personalized recommendations!"
                            )}
                        </p>
                    </motion.div>

                    {/* Due for Review */}
                    {dueReviews.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="glass-card p-6 border-yellow-500/20 bg-yellow-900/10"
                        >
                            <h3 className="font-bold mb-4 flex items-center text-yellow-400">
                                <Clock className="w-5 h-5 mr-2" /> Due for Review
                            </h3>
                            <div className="space-y-3">
                                {dueReviews.map((review, index) => (
                                    <div key={index} className="flex justify-between items-center bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        <span className="font-medium">{review.topic}</span>
                                        <span className="text-xs text-slate-400">
                                            {review.dueInDays <= 0 ? "Due Today" : `Due in ${review.dueInDays} days`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
