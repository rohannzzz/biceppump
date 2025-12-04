"use client";

import { useState, useEffect } from 'react';

export default function NutritionTracker() {
  const [calories, setCalories] = useState({
    consumed: 0,
    target: 2500,
    remaining: 2500
  });

  const [macros, setMacros] = useState({
    protein: { current: 0, target: 180 },
    carbs: { current: 0, target: 250 },
    fats: { current: 0, target: 80 }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  // Load data from local storage on mount
  useEffect(() => {
    const savedNutrition = localStorage.getItem('nutrition_data');
    if (savedNutrition) {
      const data = JSON.parse(savedNutrition);
      // Check if it's a new day
      const lastUpdated = new Date(data.date);
      const today = new Date();

      if (lastUpdated.getDate() !== today.getDate() ||
        lastUpdated.getMonth() !== today.getMonth() ||
        lastUpdated.getFullYear() !== today.getFullYear()) {
        // Reset for new day
        saveData({
          calories: { consumed: 0, target: 2500, remaining: 2500 },
          macros: {
            protein: { current: 0, target: 180 },
            carbs: { current: 0, target: 250 },
            fats: { current: 0, target: 80 }
          }
        });
      } else {
        setCalories(data.calories);
        setMacros(data.macros);
      }
    }
  }, []);

  const saveData = (data) => {
    localStorage.setItem('nutrition_data', JSON.stringify({
      ...data,
      date: new Date().toISOString()
    }));
    setCalories(data.calories);
    setMacros(data.macros);
  };

  const handleAddMeal = (e) => {
    e.preventDefault();

    const mealCalories = parseInt(newMeal.calories) || 0;
    const mealProtein = parseInt(newMeal.protein) || 0;
    const mealCarbs = parseInt(newMeal.carbs) || 0;
    const mealFats = parseInt(newMeal.fats) || 0;

    const updatedCalories = {
      ...calories,
      consumed: calories.consumed + mealCalories,
      remaining: calories.target - (calories.consumed + mealCalories)
    };

    const updatedMacros = {
      protein: { ...macros.protein, current: macros.protein.current + mealProtein },
      carbs: { ...macros.carbs, current: macros.carbs.current + mealCarbs },
      fats: { ...macros.fats, current: macros.fats.current + mealFats }
    };

    saveData({ calories: updatedCalories, macros: updatedMacros });
    setShowAddModal(false);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '' });
  };

  const quickAdd = (type) => {
    let meal = { calories: 0, protein: 0, carbs: 0, fats: 0 };

    switch (type) {
      case 'protein':
        meal = { calories: 120, protein: 24, carbs: 2, fats: 1 };
        break;
      case 'snack':
        meal = { calories: 200, protein: 5, carbs: 25, fats: 8 };
        break;
      case 'meal':
        meal = { calories: 600, protein: 40, carbs: 60, fats: 20 };
        break;
      case 'drink':
        meal = { calories: 150, protein: 0, carbs: 35, fats: 0 };
        break;
    }

    const updatedCalories = {
      ...calories,
      consumed: calories.consumed + meal.calories,
      remaining: calories.target - (calories.consumed + meal.calories)
    };

    const updatedMacros = {
      protein: { ...macros.protein, current: macros.protein.current + meal.protein },
      carbs: { ...macros.carbs, current: macros.carbs.current + meal.carbs },
      fats: { ...macros.fats, current: macros.fats.current + meal.fats }
    };

    saveData({ calories: updatedCalories, macros: updatedMacros });
  };

  const calorieProgress = Math.min((calories.consumed / calories.target) * 100, 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Nutrition Today</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 font-medium"
        >
          + Add Meal
        </button>
      </div>

      {/* Calorie Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Calories</span>
          <span className="text-sm text-gray-600">{calories.consumed} / {calories.target}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${calorieProgress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {calories.remaining > 0 ? `${calories.remaining} calories remaining` : 'Target reached!'}
        </p>
      </div>

      {/* Macros */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-700">Macronutrients</h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{macros.protein.current}g</div>
            <div className="text-xs text-gray-600">Protein</div>
            <div className="text-xs text-gray-500">{macros.protein.target}g goal</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${Math.min((macros.protein.current / macros.protein.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{macros.carbs.current}g</div>
            <div className="text-xs text-gray-600">Carbs</div>
            <div className="text-xs text-gray-500">{macros.carbs.target}g goal</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-orange-500 h-1.5 rounded-full"
                style={{ width: `${Math.min((macros.carbs.current / macros.carbs.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{macros.fats.current}g</div>
            <div className="text-xs text-gray-600">Fats</div>
            <div className="text-xs text-gray-500">{macros.fats.target}g goal</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div
                className="bg-purple-500 h-1.5 rounded-full"
                style={{ width: `${Math.min((macros.fats.current / macros.fats.target) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="font-semibold text-gray-700 mb-3">Quick Add</h4>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => quickAdd('meal')} className="bg-green-100 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-200 transition">
            Full Meal (+600)
          </button>
          <button onClick={() => quickAdd('protein')} className="bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition">
            Protein Shake (+120)
          </button>
          <button onClick={() => quickAdd('snack')} className="bg-orange-100 text-orange-700 py-2 px-3 rounded text-sm hover:bg-orange-200 transition">
            Snack (+200)
          </button>
          <button onClick={() => quickAdd('drink')} className="bg-purple-100 text-purple-700 py-2 px-3 rounded text-sm hover:bg-purple-200 transition">
            Energy Drink (+150)
          </button>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Add Custom Meal</h3>
            <form onSubmit={handleAddMeal} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Calories</label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Protein (g)</label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Carbs (g)</label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fats (g)</label>
                  <input
                    type="number"
                    value={newMeal.fats}
                    onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-medium"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 font-medium"
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