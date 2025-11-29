import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Target } from 'lucide-react';
import api from '../utils/api';

const About = () => {
    const [stats, setStats] = useState({ users: 0, questionsSolved: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        About BrainMap
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        We are on a mission to revolutionize learning through AI-driven personalization.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                        <p className="text-slate-400 leading-relaxed mb-6">
                            Founded in 2025, BrainMap started with a simple idea: everyone learns differently.
                            Traditional education often follows a "one size fits all" approach, but we believe
                            technology can bridge the gap.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            By leveraging advanced AI models like Gemini, we create dynamic, personalized
                            learning experiences that adapt to each student's pace and style.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="glass-card p-6 text-center">
                            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                            <h3 className="text-2xl font-bold">{stats.users}</h3>
                            <p className="text-sm text-slate-400">Active Learners</p>
                        </div>
                        <div className="glass-card p-6 text-center">
                            <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                            <h3 className="text-2xl font-bold">{stats.questionsSolved}</h3>
                            <p className="text-sm text-slate-400">Questions Solved</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card p-8 md:p-12 text-center"
                >
                    <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-primary mb-2">Innovation</h3>
                            <p className="text-slate-400 text-sm">Pushing the boundaries of what's possible in education technology.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-secondary mb-2">Accessibility</h3>
                            <p className="text-slate-400 text-sm">Making high-quality education available to everyone, everywhere.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-accent mb-2">Growth</h3>
                            <p className="text-slate-400 text-sm">Fostering a mindset of continuous improvement and lifelong learning.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
