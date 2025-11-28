import React from 'react';
import { ArrowRight, Brain, Zap, Trophy, CheckCircle, Users, Star, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 1. Hero Section */}
            <section className="relative flex items-center justify-center min-h-screen pt-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent z-0" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block mb-4 px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-primary font-medium"
                    >
                        ✨ The Future of Learning is Here
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent"
                    >
                        Master Any Topic <br /> with AI-Powered Quizzes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
                    >
                        Instantly generate quizzes on any subject. Test your knowledge, get detailed explanations, and track your progress with our intelligent learning platform.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/dashboard" className="px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50 flex items-center">
                            Start Learning <ArrowRight className="ml-2" />
                        </Link>

                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 flex justify-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium"
                    >
                        <span className="flex items-center"><Zap className="w-4 h-4 mr-2 text-yellow-400" /> Lightning Fast</span>
                        <span className="flex items-center"><Shield className="w-4 h-4 mr-2 text-green-400" /> Secure & Private</span>
                        <span className="flex items-center"><Brain className="w-4 h-4 mr-2 text-purple-400" /> AI Powered</span>
                    </motion.div>
                </div>
            </section>

            {/* 2. Key Features Section */}
            <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose BrainMap?</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to accelerate your learning journey.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Brain className="w-8 h-8 text-primary" />}
                            title="AI Generated"
                            desc="Unlimited questions on any topic generated instantly by Gemini AI."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8 text-secondary" />}
                            title="Instant Feedback"
                            desc="Get detailed explanations for every answer to learn from mistakes."
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-accent" />}
                            title="Track Progress"
                            desc="Visualize your learning journey with detailed analytics and history."
                        />
                        <FeatureCard
                            icon={<Clock className="w-8 h-8 text-green-400" />}
                            title="Timed Mode"
                            desc="Challenge yourself with timed quizzes to improve speed and accuracy."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8 text-red-400" />}
                            title="Secure Platform"
                            desc="Your data and learning history are safe with our enterprise-grade security."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-yellow-400" />}
                            title="Community"
                            desc="Join thousands of learners and share your achievements."
                        />
                    </div>
                </div>
            </section>

            {/* 3. Showcase Section */}
            <section id="showcase" className="py-20 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Future of Learning</h2>
                            <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                                Our intuitive interface makes learning engaging and effective. With real-time feedback and beautiful visualizations, you'll stay motivated to reach your goals.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {['Interactive Quiz Interface', 'Detailed Performance Analytics', 'Downloadable PDF Reports'].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-600 dark:text-slate-300">
                                        <CheckCircle className="w-5 h-5 text-primary mr-3" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/dashboard" className="text-primary font-bold hover:text-primary/80 flex items-center">
                                Explore Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </div>
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-3xl opacity-20 rounded-full" />
                            <div className="glass-card p-4 transform rotate-2 hover:rotate-0 transition-all duration-500">
                                {/* Mock UI Representation */}
                                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                                        <div className="h-8 w-8 bg-primary rounded-full" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                                        <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
                                        <div className="grid gap-3 mt-6">
                                            {[1, 2, 3, 4].map(i => (
                                                <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Why Choose Us */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Learners Love Us</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { title: 'Faster Learning', desc: 'Adaptive algorithms help you learn 2x faster.' },
                            { title: 'Modern UI', desc: 'Clean, distraction-free interface designed for focus.' },
                            { title: 'Easy to Use', desc: 'Start your first quiz in seconds. No setup required.' },
                            { title: 'Trusted', desc: 'Used by students and professionals worldwide.' }
                        ].map((item, i) => (
                            <div key={i} className="p-6">
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Testimonials */}
            <section id="testimonials" className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Our Users Say</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <TestimonialCard
                            name="Rohit"
                            role="AI & ML Expert"
                            content="BrainMap helped me ace my certification exams. The AI-generated questions are spot on!"
                        />
                        <TestimonialCard
                            name="Pittowas"
                            role="Senior Data Scientist"
                            content="The detailed explanations are a game changer. It's like having a personal tutor 24/7."
                        />
                        <TestimonialCard
                            name="Atul"
                            role="Machine Learning Engineer"
                            content="I love the analytics dashboard. Seeing my progress motivates me to keep learning every day."
                        />
                    </div>
                </div>
            </section>

            {/* 6. CTA Banner */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-pattern opacity-10" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">Ready to Master Your Next Topic?</h2>
                        <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto relative z-10">
                            Join thousands of learners who are already using BrainMap to achieve their goals.
                        </p>
                        <Link to="/dashboard" className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-full text-lg hover:bg-slate-100 transition-colors shadow-xl relative z-10">
                            Start Planning Now
                        </Link>
                    </div>
                </div>
            </section>


        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="glass-card p-8"
    >
        <div className="mb-4 bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-2xl flex items-center justify-center">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400">{desc}</p>
    </motion.div>
);

const TestimonialCard = ({ name, role, content }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="glass-card p-8"
    >
        <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-xl mr-4 text-slate-700 dark:text-white">
                {name[0]}
            </div>
            <div>
                <h4 className="font-bold">{name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{role}</p>
            </div>
        </div>
        <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
        </div>
        <p className="text-slate-600 dark:text-slate-300 italic">"{content}"</p>
    </motion.div>
);

export default LandingPage;
