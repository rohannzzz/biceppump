"use client";

import { useState, useEffect } from 'react';

export default function WorkoutTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setTime(0);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Workout Timer</h3>
      <div className="text-center">
        <div className="text-4xl font-mono font-bold text-red-600 mb-4">
          {formatTime(time)}
        </div>
        <div className="space-x-3">
          <button
            onClick={toggle}
            className={`px-6 py-2 rounded font-semibold ${
              isActive 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}