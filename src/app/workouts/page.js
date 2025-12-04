"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { API_ENDPOINTS } from "@/config/api";
import Link from "next/link";

export default function Workouts() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: ""
  });
  const [exercises, setExercises] = useState([]);
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: "",
    reps: "",
    weight: "",
    muscleGroup: ""
  });

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
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts || []);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const url = editingWorkout
        ? `${API_ENDPOINTS.WORKOUTS}/${editingWorkout.id}`
        : API_ENDPOINTS.WORKOUTS;

      const method = editingWorkout ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingWorkout ? 'Workout updated!' : 'Workout created!');
        setShowModal(false);
        setFormData({ name: "", description: "", duration: "" });
        setEditingWorkout(null);
        fetchWorkouts();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to save workout');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_ENDPOINTS.WORKOUTS}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('Workout deleted!');
        fetchWorkouts();
      }
    } catch (error) {
      alert('Error deleting workout');
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      name: workout.name,
      description: workout.description || "",
      duration: workout.duration || ""
    });
    setShowModal(true);
  };

  const handleAddExercise = async (workoutId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(API_ENDPOINTS.EXERCISES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ ...exerciseForm, workoutId })
      });

      if (response.ok) {
        alert('Exercise added!');
        setExerciseForm({ name: "", sets: "", reps: "", weight: "", muscleGroup: "" });
        fetchWorkouts();
      }
    } catch (error) {
      alert('Error adding exercise');
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
              <Link href="/workouts" className="text-red-600 font-medium">Workouts</Link>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Workouts</h2>
            <p className="text-gray-600">Track and manage your workout sessions</p>
          </div>
          <button
            onClick={() => {
              setShowModal(true);
              setEditingWorkout(null);
              setFormData({ name: "", description: "", duration: "" });
            }}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            + New Workout
          </button>
        </div>

        {/* Workouts List */}
        <div className="grid grid-cols-1 gap-6">
          {workouts.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <p className="text-gray-600 text-lg">No workouts yet. Create your first workout!</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{workout.name}</h3>
                    {workout.description && (
                      <p className="text-gray-600 mt-1">{workout.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📅 {new Date(workout.createdAt).toLocaleDateString()}</span>
                      {workout.duration && <span>⏱️ {workout.duration} min</span>}
                      <span>💪 {workout.exercises?.length || 0} exercises</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Exercises */}
                {workout.exercises && workout.exercises.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Exercises:</h4>
                    <div className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                          <div>
                            <span className="font-medium">{exercise.name}</span>
                            {exercise.muscleGroup && (
                              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                {exercise.muscleGroup}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6">
              {editingWorkout ? 'Edit Workout' : 'Create New Workout'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Workout Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
                >
                  {editingWorkout ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingWorkout(null);
                    setFormData({ name: "", description: "", duration: "" });
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