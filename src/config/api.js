// Use environment variable for API URL, with fallback to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  PROFILE: `${API_BASE_URL}/api/auth/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/auth/profile`,
  WORKOUTS: `${API_BASE_URL}/api/workouts`,
  EXERCISES: `${API_BASE_URL}/api/exercises`,
};