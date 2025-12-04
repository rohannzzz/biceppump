"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/config/api";

export default function ProfileSetup() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    activityLevel: ""
  });

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
        alert('Profile completed successfully!');
        router.push('/dashboard');
      } else {
        alert(data.message || 'Profile update failed');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Complete Your Profile</h1>
          <p className="text-center text-gray-600 mb-8">Help us personalize your fitness journey</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                  required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                required
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
              {loading ? 'Saving Profile...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}