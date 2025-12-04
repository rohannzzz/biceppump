const { verifyTokens } = require("../Utils/token.js");
const prisma = require("../db/prisma.js");

const authenticateToken = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('Cookies:', req.cookies);
    console.log('Authorization header:', req.headers.authorization);

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log('Extracted token:', token ? 'Token found' : 'No token');

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: "Access token required!" });
    }

    const decoded = verifyTokens(token);
    console.log('Token decoded:', decoded ? 'Success' : 'Failed');
    console.log('Decoded payload:', decoded);

    if (!decoded) {
      console.log('Token verification failed');
      return res.status(401).json({ message: "Invalid or expired token!" });
    }

    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, phoneNumber: true, age: true, gender: true, height: true, weight: true, fitnessGoal: true, activityLevel: true, profileCompleted: true }
    });

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User data:', user);

    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: "User not found!" });
    }

    req.user = user;
    console.log('Authentication successful');
    console.log('============================');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: "Server error during authentication!" });
  }
};

module.exports = { authenticateToken };