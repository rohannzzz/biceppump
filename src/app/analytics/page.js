"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS, API_BASE_URL } from "@/config/api";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [pumpScore, setPumpScore] = useState(null);
    const [prs, setPrs] = useState([]);
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchAnalytics();
        }
    }, [user, authLoading, router]);

    const fetchAnalytics = async () => {
        const token = localStorage.getItem('token');

        try {
            // Fetch Pump Score
            const scoreRes = await fetch(`${API_BASE_URL}/api/analytics/pump-score`, {
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
            if (scoreRes.ok) {
                const scoreData = await scoreRes.json();
                setPumpScore(scoreData);
            }

            // Fetch Personal Records
            const prsRes = await fetch(`${API_BASE_URL}/api/analytics/prs`, {
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
            if (prsRes.ok) {
                const prsData = await prsRes.json();
                setPrs(prsData.personalRecords || []);
            }

            // Fetch Progress Data
            const progressRes = await fetch(`${API_BASE_URL}/api/analytics/progress`, {
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
            if (progressRes.ok) {
                const progressData = await progressRes.json();
                setProgressData(progressData.progressData || []);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    if (authLoading || loading) {
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
                            <Link href="/analytics" className="text-red-600 font-medium">Analytics</Link>
                            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900 font-medium transition">Leaderboard</Link>
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
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress Analytics</h2>
                    <p className="text-gray-600">Track your fitness journey and achievements</p>
                </div>

                {/* Pump Score */}
                {pumpScore && (
                    <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-8 rounded-xl shadow-lg mb-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Your Pump Score</h3>
                            <div className="text-6xl font-black mb-4">{pumpScore.pumpScore}</div>
                            <p className="text-red-100 mb-6">Based on your last 30 days of training</p>

                            {pumpScore.breakdown && (
                                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                        <div className="text-3xl font-bold">{pumpScore.breakdown.volume}</div>
                                        <div className="text-sm text-red-100">Volume Score</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                        <div className="text-3xl font-bold">{pumpScore.breakdown.intensity}</div>
                                        <div className="text-sm text-red-100">Intensity Score</div>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                                        <div className="text-3xl font-bold">{pumpScore.breakdown.frequency}</div>
                                        <div className="text-sm text-red-100">Frequency Score</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Records */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Personal Records</h3>
                        {prs.length === 0 ? (
                            <p className="text-gray-600">No personal records yet. Keep training!</p>
                        ) : (
                            <div className="space-y-3">
                                {prs.slice(0, 10).map((pr, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <div className="font-semibold">{pr.exercise}</div>
                                            {pr.muscleGroup && (
                                                <div className="text-xs text-gray-500">{pr.muscleGroup}</div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-red-600">{pr.weight}kg</div>
                                            <div className="text-xs text-gray-500">{pr.sets}×{pr.reps}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress Charts */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Strength Progress</h3>
                        {progressData.length === 0 ? (
                            <p className="text-gray-600">No progress data yet. Start logging workouts!</p>
                        ) : (
                            <div className="space-y-6">
                                {progressData.slice(0, 3).map((exerciseData, index) => {
                                    const chartData = exerciseData.data.map((point, idx) => ({
                                        name: `Session ${idx + 1}`,
                                        weight: point.weight,
                                        volume: point.volume
                                    }));

                                    return (
                                        <div key={index}>
                                            <h4 className="font-semibold text-gray-700 mb-2">{exerciseData.exercise}</h4>
                                            <ResponsiveContainer width="100%" height={150}>
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                                    <YAxis tick={{ fontSize: 12 }} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="weight" stroke="#dc2626" strokeWidth={2} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-red-600">{prs.length}</div>
                        <div className="text-gray-600 mt-1">Personal Records</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-blue-600">{pumpScore?.breakdown?.workoutCount || 0}</div>
                        <div className="text-gray-600 mt-1">Workouts (30 days)</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-green-600">{progressData.length}</div>
                        <div className="text-gray-600 mt-1">Exercises Tracked</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow text-center">
                        <div className="text-3xl font-bold text-purple-600">{pumpScore?.pumpScore || 0}</div>
                        <div className="text-gray-600 mt-1">Pump Score</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
