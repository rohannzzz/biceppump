"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        router.push('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl">💪</div>
          <span className="text-2xl font-bold text-orange-500">BicepPump</span>
        </Link>
      </nav>
      
      <div className="flex items-center justify-center py-16">
        <div className="w-full max-w-sm bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-6 text-center">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-orange-500"
              required
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-orange-500"
              required
            />
            
            <button className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700">
              Login
            </button>
          </form>
          
          <p className="text-center mt-4 text-sm">
            <Link href="/signup" className="text-orange-600 hover:underline">
              Create account
            </Link>
          </p>
          
          <button 
            onClick={() => window.open('https://biceppump.onrender.com', '_blank')}
            className="w-full mt-4 bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
          >
            Check Server Status
          </button>
        </div>
      </div>
    </div>
  );
}