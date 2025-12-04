"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";

export default function Profile() {
    const router = useRouter();
    const { user, loading: authLoading, logout, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('info');
    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        height: "",
        weight: "",
        fitnessGoal: "",
        activityLevel: ""
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            setFormData({
                age: user.age || "",
                gender: user.gender || "",
                height: user.height || "",
                weight: user.weight || "",
                fitnessGoal: user.fitnessGoal || "",
                activityLevel: user.activityLevel || ""
            });
        }
    }, [user, authLoading, router]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                await checkAuth(); // Refresh user data
            } else {
                alert(data.message || 'Profile update failed');
            }
        } catch (error) {
            alert('Network error: ' + error.message);
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
                            <Link href="/exercises" className="text-gray-600 hover:text-gray-900 font-medium transition">Exercises</Link>
                            <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition">Analytics</Link>
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
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h2>
                    <p className="text-gray-600">Manage your account and fitness information</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'info'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab('fitness')}
                                className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === 'fitness'
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                Fitness Profile
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {activeTab === 'info' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                {user.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                                            {user.phoneNumber}
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t">
                                        <p className="text-sm text-gray-500">
                                            To update your name, email, or phone number, please contact support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'fitness' && (
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Fitness Information</h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                min="13"
                                                max="100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                                            <input
                                                type="number"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                min="100"
                                                max="250"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                                            <input
                                                type="number"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                min="30"
                                                max="300"
                                                step="0.1"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Goal</label>
                                        <select
                                            name="fitnessGoal"
                                            value={formData.fitnessGoal}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">Select Your Goal</option>
                                            <option value="weight_loss">Weight Loss</option>
                                            <option value="muscle_gain">Muscle Gain</option>
                                            <option value="strength">Build Strength</option>
                                            <option value="endurance">Improve Endurance</option>
                                            <option value="general_fitness">General Fitness</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
                                        <select
                                            name="activityLevel"
                                            value={formData.activityLevel}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            <option value="">Select Activity Level</option>
                                            <option value="sedentary">Sedentary (Little to no exercise)</option>
                                            <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                                            <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                                            <option value="very_active">Very Active (6-7 days/week)</option>
                                            <option value="extremely_active">Extremely Active (2x/day or intense training)</option>
                                        </select>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50"
                                    >
                                        {loading ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Card */}
                <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Account Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{user.pumpScore || 0}</div>
                            <div className="text-sm text-gray-600 mt-1">Pump Score</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {user.profileCompleted ? '✓' : '○'}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Profile Status</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Member Since</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">Premium</div>
                            <div className="text-sm text-gray-600 mt-1">Membership</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
