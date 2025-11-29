import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error details:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Login failed';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md glass-card p-8"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl mb-4">
                        <Brain className="text-white w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400">Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-500 dark:text-slate-400 mb-2 text-sm font-medium">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-500 dark:text-slate-400 mb-2 text-sm font-medium">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                        Sign Up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
