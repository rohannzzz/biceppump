"use client";

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/api';

export default function WorkoutStats() {
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalExercises: 0,
        thisWeek: 0,
        thisMonth: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/workouts`, {
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                const workouts = data.workouts || [];

                // Calculate stats
                const now = new Date();
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

                const thisWeekCount = workouts.filter(w => new Date(w.createdAt) >= weekAgo).length;
                const thisMonthCount = workouts.filter(w => new Date(w.createdAt) >= monthAgo).length;
                const totalExercises = workouts.reduce((sum, w) => sum + (w.exercises?.length || 0), 0);

                setStats({
                    totalWorkouts: workouts.length,
                    totalExercises,
                    thisWeek: thisWeekCount,
                    thisMonth: thisMonthCount
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">This Week</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.thisWeek}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📅</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Workouts completed</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">This Month</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.thisMonth}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Monthly progress</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Total Workouts</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalWorkouts}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">💪</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">All time</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm font-medium">Total Exercises</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalExercises}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🏋️</span>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Exercises logged</p>
            </div>
        </div>
    );
}
