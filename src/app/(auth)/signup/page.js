"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "../../config/api";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userName', formData.name);
        alert('Signup successful!');
        router.push('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-red-900">
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl">💪</div>
            <span className="text-2xl font-bold text-orange-500">BicepPump</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
              Login
            </Link>
            <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm bg-red-950 p-8 rounded-lg shadow-2xl border border-red-800">
          <h2 className="text-3xl font-black mb-6 text-center text-red-100 tracking-wide">SIGN UP</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-red-900 border border-red-700 rounded text-red-100 placeholder-red-400 focus:outline-none focus:border-red-500"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-red-900 border border-red-700 rounded text-red-100 placeholder-red-400 focus:outline-none focus:border-red-500"
              required
            />
            
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-red-900 border border-red-700 rounded text-red-100 placeholder-red-400 focus:outline-none focus:border-red-500"
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-red-900 border border-red-700 rounded text-red-100 placeholder-red-400 focus:outline-none focus:border-red-500"
              required
            />
            
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-red-900 border border-red-700 rounded text-red-100 placeholder-red-400 focus:outline-none focus:border-red-500"
              required
            />
            
            <button className="w-full bg-red-700 text-white py-3 rounded font-bold hover:bg-red-600 transition">
              Sign Up
            </button>
          </form>
          
          <p className="text-center mt-6 text-sm">
            <Link href="/login" className="text-red-300 hover:text-red-200 hover:underline">
              Already have an account?
            </Link>
          </p>
          
          <p className="text-center mt-4 text-sm">
            <a 
              href="https://biceppump.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 hover:underline"
            >
              Check Server Status
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}