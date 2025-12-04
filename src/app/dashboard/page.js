"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import WorkoutTimer from "@/components/WorkoutTimer";
import NutritionTracker from "@/components/NutritionTracker";
import WorkoutStats from "@/components/WorkoutStats";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">BicepPump</h1>
            <div className="hidden md:flex space-x-8">
              <a href="/dashboard" className="text-red-600 font-medium transition">Dashboard</a>
              <a href="/workouts" className="text-gray-600 hover:text-gray-900 font-medium transition">Workouts</a>
              <a href="/exercises" className="text-gray-600 hover:text-gray-900 font-medium transition">Exercises</a>
              <a href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium transition">Analytics</a>
              <a href="/leaderboard" className="text-gray-600 hover:text-gray-900 font-medium transition">Leaderboard</a>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 font-medium">Hi, {user.name.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Track your fitness journey and achieve your goals</p>
          </div>

          {/* Stats Cards */}
          <WorkoutStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Workout */}
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Today's Workout Plan</h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h4 className="font-semibold text-lg">Upper Body Strength</h4>
                    <p className="text-gray-600">Focus: Chest, Shoulders, Triceps</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center">
                        <span>Bench Press</span>
                        <span className="text-sm bg-red-100 px-2 py-1 rounded">4 sets × 8-10 reps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shoulder Press</span>
                        <span className="text-sm bg-red-100 px-2 py-1 rounded">3 sets × 10-12 reps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tricep Dips</span>
                        <span className="text-sm bg-red-100 px-2 py-1 rounded">3 sets × 12-15 reps</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Push-ups</span>
                        <span className="text-sm bg-red-100 px-2 py-1 rounded">3 sets × 15-20 reps</span>
                      </div>
                    </div>
                    <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Workouts */}
              <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Recent Workouts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">L</div>
                      <div>
                        <p className="font-semibold">Leg Day</p>
                        <p className="text-sm text-gray-600">Yesterday • 1h 15m</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">Completed</p>
                      <p className="text-sm text-gray-600">485 calories</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">U</div>
                      <div>
                        <p className="font-semibold">Upper Body</p>
                        <p className="text-sm text-gray-600">2 days ago • 1h 5m</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">Completed</p>
                      <p className="text-sm text-gray-600">420 calories</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">C</div>
                      <div>
                        <p className="font-semibold">Cardio HIIT</p>
                        <p className="text-sm text-gray-600">3 days ago • 45m</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">Completed</p>
                      <p className="text-sm text-gray-600">380 calories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Member Since:</span>
                      <span className="font-semibold">Nov 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Membership:</span>
                      <span className="font-semibold text-red-600">Premium</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Goals */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Current Goals</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Weight Loss</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Muscle Gain</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Endurance</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h3>
                <div className="space-y-3">
                  <a href="/workouts" className="block w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition text-center font-medium">
                    Log Workout
                  </a>
                  <a href="/analytics" className="block w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition text-center font-medium">
                    View Progress
                  </a>
                  <a href="/exercises" className="block w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition text-center font-medium">
                    Manage Exercises
                  </a>
                  <a href="/leaderboard" className="block w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition text-center font-medium">
                    View Leaderboard
                  </a>
                </div>
              </div>

              {/* Workout Timer */}
              <WorkoutTimer />

              {/* Nutrition Tracker */}
              <NutritionTracker />

              {/* Achievements */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                    <div className="text-2xl font-bold text-yellow-600">1st</div>
                    <div>
                      <p className="font-semibold text-sm">7-Day Streak</p>
                      <p className="text-xs text-gray-600">Completed 7 consecutive workouts</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">STR</div>
                    <div>
                      <p className="font-semibold text-sm">Strength Milestone</p>
                      <p className="text-xs text-gray-600">Bench pressed 100kg</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-red-600">CAL</div>
                    <div>
                      <p className="font-semibold text-sm">Calorie Crusher</p>
                      <p className="text-xs text-gray-600">Burned 500+ calories in one session</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}