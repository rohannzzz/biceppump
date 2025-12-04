"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";

export default function Exercises() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    muscleGroup: ""
  });

  const muscleGroups = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Cardio"];

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchWorkouts();
    }
  }, [user, authLoading, router]);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.WORKOUTS, {
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts || []);
        if (data.workouts && data.workouts.length > 0) {
          setSelectedWorkout(data.workouts[0]);
          setExercises(data.workouts[0].exercises || []);
        }
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSelect = (workout) => {
    setSelectedWorkout(workout);
    setExercises(workout.exercises || []);
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    if (!selectedWorkout) {
      alert('Please select a workout first');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.EXERCISES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          ...exerciseForm,
          workoutId: selectedWorkout.id
        })
      });

      if (response.ok) {
        alert('Exercise added successfully!');
        setShowModal(false);
        setExerciseForm({ name: "", sets: "", reps: "", weight: "", muscleGroup: "" });
        fetchWorkouts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add exercise');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_ENDPOINTS.EXERCISES}/${exerciseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Exercise deleted!');
        fetchWorkouts();
      }
    } catch (error) {
      alert('Error deleting exercise');
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Exercise Management</h2>
            <p className="text-gray-600">Add and manage exercises for your workouts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={!selectedWorkout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Exercise
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Workout Selector */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-gray-900 mb-4">Select Workout</h3>
              {workouts.length === 0 ? (
                <p className="text-gray-600 text-sm">No workouts available. Create one first!</p>
              ) : (
                <div className="space-y-2">
                  {workouts.map((workout) => (
                    <button
                      key={workout.id}
                      onClick={() => handleWorkoutSelect(workout)}
                      className={`w-full text-left p-3 rounded-lg transition ${selectedWorkout?.id === workout.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
                        }`}
                    >
                      <div className="font-semibold">{workout.name}</div>
                      <div className={`text-xs ${selectedWorkout?.id === workout.id ? 'text-red-100' : 'text-gray-500'}`}>
                        {workout.exercises?.length || 0} exercises
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Exercises List */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow">
              {!selectedWorkout ? (
                <p className="text-gray-600 text-center py-12">Select a workout to view exercises</p>
              ) : exercises.length === 0 ? (
                <p className="text-gray-600 text-center py-12">No exercises in this workout. Add your first exercise!</p>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Exercises in "{selectedWorkout.name}"
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exercises.map((exercise) => (
                      <div key={exercise.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-900">{exercise.name}</h4>
                            {exercise.muscleGroup && (
                              <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                {exercise.muscleGroup}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            className="text-red-600 hover:text-red-700 font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Sets:</span>
                            <span className="font-semibold">{exercise.sets}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reps:</span>
                            <span className="font-semibold">{exercise.reps}</span>
                          </div>
                          {exercise.weight && (
                            <div className="flex justify-between">
                              <span>Weight:</span>
                              <span className="font-semibold">{exercise.weight} kg</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Exercise Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">Add Exercise to "{selectedWorkout?.name}"</h3>
            <form onSubmit={handleAddExercise} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Name</label>
                <input
                  type="text"
                  value={exerciseForm.name}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                  placeholder="e.g., Bench Press"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                  <input
                    type="number"
                    value={exerciseForm.sets}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, sets: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                  <input
                    type="number"
                    value={exerciseForm.reps}
                    onChange={(e) => setExerciseForm({ ...exerciseForm, reps: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) - Optional</label>
                <input
                  type="number"
                  step="0.5"
                  value={exerciseForm.weight}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, weight: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Leave empty if bodyweight"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Muscle Group</label>
                <select
                  value={exerciseForm.muscleGroup}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, muscleGroup: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select muscle group</option>
                  {muscleGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
                >
                  Add Exercise
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setExerciseForm({ name: "", sets: "", reps: "", weight: "", muscleGroup: "" });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}