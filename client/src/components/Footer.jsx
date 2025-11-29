import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-12 border-t border-slate-800 bg-slate-900">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <Brain className="text-white w-5 h-5" />
                            </div>
                            <span className="text-white">BrainMap</span>
                        </Link>
                        <p className="text-slate-400">Empowering learners worldwide with AI-driven assessment tools.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="/#features" className="hover:text-primary">Features</a></li>
                            <li><a href="/#showcase" className="hover:text-primary">Showcase</a></li>
                            <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
                    <p>© 2025 BrainMap. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
