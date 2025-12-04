"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/config/api";
import Link from "next/link";

export default function Leaderboard() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [leaderboard, setLeaderboard] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchLeaderboard(currentPage);
        }
    }, [user, authLoading, router, currentPage]);

    const fetchLeaderboard = async (page) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/leaderboard?page=${page}&limit=20`);

            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data.leaderboard || []);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="flex items-center space-x-8">
                        <h1 className="text-2xl font-bold text-gray-900">BicepPump</h1>
                        <div className="hidden md:flex space-x-8">
                            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium transition">Dashboard</Link>
                            <Link href="/workouts" className="text-gray-600 hover:text-gray-900 font-medium transition">Workouts</Link>
                            <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition">Analytics</Link>
                            <Link href="/leaderboard" className="text-red-600 font-medium">Leaderboard</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Hi, {user.name.split(' ')[0]}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">🏆 Leaderboard</h2>
                    <p className="text-gray-600">Top performers ranked by Pump Score</p>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-red-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold">Rank</th>
                                    <th className="px-6 py-4 text-left font-bold">Name</th>
                                    <th className="px-6 py-4 text-right font-bold">Pump Score</th>
                                    <th className="px-6 py-4 text-right font-bold">Member Since</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Loading leaderboard...
                                        </td>
                                    </tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No users on the leaderboard yet
                                        </td>
                                    </tr>
                                ) : (
                                    leaderboard.map((entry, index) => {
                                        const isCurrentUser = entry.id === user.id;
                                        const medalEmoji = entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : '';

                                        return (
                                            <tr
                                                key={entry.id}
                                                className={`border-b border-gray-200 ${isCurrentUser ? 'bg-red-50' : 'hover:bg-gray-50'} transition`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl">{medalEmoji}</span>
                                                        <span className={`font-bold text-lg ${entry.rank <= 3 ? 'text-red-600' : 'text-gray-700'}`}>
                                                            #{entry.rank}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {entry.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className={`font-semibold ${isCurrentUser ? 'text-red-600' : 'text-gray-900'}`}>
                                                                {entry.name} {isCurrentUser && '(You)'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-2xl font-black text-red-600">{entry.pumpScore}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-600">
                                                    {new Date(entry.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                            <div className="text-sm text-gray-600">
                                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} users
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium">
                                    Page {currentPage} of {pagination.totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-bold text-blue-900 mb-2">💡 How is Pump Score calculated?</h3>
                    <p className="text-blue-800 text-sm">
                        Your Pump Score is calculated based on your workout volume (40%), intensity (30%), and frequency (30%) over the last 30 days.
                        Keep training consistently and pushing your limits to climb the leaderboard!
                    </p>
                </div>
            </div>
        </div>
    );
}
