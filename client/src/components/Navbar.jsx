import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Brain, Menu, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    // ... existing state ...
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const homeLinks = [
        { name: 'Features', path: '/#features' },
        { name: 'Showcase', path: '/#showcase' },
        { name: 'Testimonials', path: '/#testimonials' },
        { name: 'About', path: '/about' },
    ];

    const appLinks = [
        { name: 'Dashboard', path: '/dashboard' },
    ];

    const navLinks = isHome ? homeLinks : appLinks;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/80 dark:bg-dark/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">BrainMap</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            isHome ? (
                                <a key={link.name} href={link.path} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium">
                                    {link.name}
                                </a>
                            ) : (
                                <Link key={link.name} to={link.path} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium">
                                    {link.name}
                                </Link>
                            )
                        ))}

                        <ThemeToggle />

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{user.username}</span>
                                </div>
                                <button onClick={handleLogout} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white" title="Logout">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/25">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <ThemeToggle />
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 dark:text-white">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                isHome ? (
                                    <a key={link.name} href={link.path} onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white py-3 text-lg font-medium border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                                        {link.name}
                                    </Link>
                                )
                            ))}

                            {user ? (
                                <>
                                    <div className="py-4 border-t border-slate-200 dark:border-slate-800 mt-2">
                                        <div className="flex items-center space-x-3 mb-6">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 dark:text-white">{user.username}</span>
                                                <span className="text-xs text-slate-500">Logged in</span>
                                            </div>
                                        </div>
                                        <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left text-red-500 hover:text-red-600 py-3 flex items-center font-medium bg-red-50 dark:bg-red-900/10 px-4 rounded-xl transition-colors">
                                            <LogOut className="w-5 h-5 mr-3" /> Sign Out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-center py-3 text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium border border-slate-200 dark:border-slate-700 rounded-xl">
                                        Login
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full text-center py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
