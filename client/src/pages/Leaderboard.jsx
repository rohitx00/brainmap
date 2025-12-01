import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLeaderboard();
    }, [page]);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/gamification/leaderboard?page=${page}&limit=10`);
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            setLoading(false);
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-slate-800 dark:text-white">🏆 Leaderboard</h1>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-center">Rank</th>
                                <th className="py-3 px-6">User</th>
                                <th className="py-3 px-6 text-center">XP</th>
                                <th className="py-3 px-6 text-center">Badges</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-600 dark:text-slate-200 text-sm font-light">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">Loading...</td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id} className="border-b border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">
                                        <td className="py-3 px-6 text-center whitespace-nowrap font-bold">
                                            {(page - 1) * 10 + index + 1}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="flex items-center">
                                                <span className="font-medium">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 text-center font-bold text-indigo-500">
                                            {user.xp}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex justify-center space-x-1">
                                                {user.badges.map((badge, i) => (
                                                    <span key={i} className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300 border border-yellow-300">
                                                        {badge}
                                                    </span>
                                                ))}
                                                {user.badges.length === 0 && <span className="text-gray-400">-</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    Previous
                </button>
                <span className="text-slate-600 dark:text-slate-300">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
