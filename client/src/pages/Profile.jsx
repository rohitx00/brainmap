import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Edit2, Lock, Save, X, Award, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Edit Profile State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', email: '' });
    const [editStatus, setEditStatus] = useState({ type: '', message: '' });

    // Change Password State
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        if (user?.userId) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/auth/profile/${user.userId}`);
            setProfile(response.data);
            setEditForm({
                username: response.data.user.username,
                email: response.data.user.email
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setEditStatus({ type: '', message: '' });

        try {
            const response = await api.put(`/auth/profile/${user.userId}`, editForm);
            setProfile(prev => ({ ...prev, user: response.data.user }));

            // Update local storage and context if username changed
            if (user.username !== response.data.user.username) {
                const updatedUser = { ...user, username: response.data.user.username };
                login(updatedUser);
            }

            setEditStatus({ type: 'success', message: 'Profile updated successfully!' });

            // Close modal after delay
            setTimeout(() => {
                setIsEditOpen(false);
                setEditStatus({ type: '', message: '' });
            }, 1500);
        } catch (err) {
            setEditStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update profile' });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordStatus({ type: '', message: '' });

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        try {
            await api.put(`/auth/profile/${user.userId}/password`, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });

            // Close modal after delay
            setTimeout(() => {
                setIsPasswordOpen(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setPasswordStatus({ type: '', message: '' });
            }, 1500);
        } catch (err) {
            setPasswordStatus({ type: 'error', message: err.response?.data?.error || 'Failed to change password' });
        }
    };

    if (loading) return <div className="text-center py-10">Loading profile...</div>;

    if (!user) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Please Log In</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">You need to be logged in to view your profile.</p>
                <a href="/login" className="px-6 py-2 bg-primary text-white rounded-full font-bold">Go to Login</a>
            </div>
        );
    }

    if (!profile) return <div className="text-center py-10">Profile not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header / User Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-8">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="px-6 md:px-8 pb-8">
                    <div className="relative flex flex-col md:flex-row justify-between items-end md:items-end -mt-12 mb-6 gap-4">
                        <div className="flex items-end">
                            <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-full p-1 shadow-lg">
                                <div className="w-full h-full bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-3xl font-bold text-slate-500 dark:text-slate-300">
                                    {profile.user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="ml-4 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">{profile.user.username}</h1>
                                <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-sm md:text-base">
                                    <Mail className="w-4 h-4" /> {profile.user.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setIsEditOpen(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => setIsPasswordOpen(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                            >
                                <Lock className="w-4 h-4" /> Security
                            </button>
                        </div>
                    </div>

                    {/* Global Messages (only for fetch errors) */}
                    {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 md:p-4 rounded-xl text-center">
                            <div className="text-xl md:text-2xl font-bold text-indigo-600 dark:text-indigo-400">{profile.stats.totalQuizzes}</div>
                            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quizzes</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 md:p-4 rounded-xl text-center">
                            <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{profile.stats.avgScore}%</div>
                            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Avg Score</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 md:p-4 rounded-xl text-center">
                            <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.round(profile.stats.totalTimeSpent / 60)}m</div>
                            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Time Spent</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-700/50 p-3 md:p-4 rounded-xl text-center">
                            <div className="text-xl md:text-2xl font-bold text-amber-600 dark:text-amber-400">{profile.user.xp}</div>
                            <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Total XP</div>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-yellow-500" /> Badges Earned
                        </h3>
                        {profile.user.badges.length > 0 ? (
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {profile.user.badges.map((badge, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full text-xs md:text-sm font-medium border border-yellow-200 dark:border-yellow-700/50">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic text-sm">No badges earned yet. Keep taking quizzes!</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsEditOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Edit Profile</h3>
                                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>

                            {editStatus.message && (
                                <div className={`p-3 rounded-lg mb-4 text-sm ${editStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {editStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
                                    <input
                                        type="text"
                                        value={editForm.username}
                                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Change Password Modal */}
            <AnimatePresence>
                {isPasswordOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsPasswordOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 m-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Change Password</h3>
                                <button onClick={() => setIsPasswordOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                            </div>

                            {passwordStatus.message && (
                                <div className={`p-3 rounded-lg mb-4 text-sm ${passwordStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {passwordStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsPasswordOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium">Update Password</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
