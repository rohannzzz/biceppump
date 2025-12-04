const prisma = require("../db/prisma.js");
const { hashPassword, verifyPassword } = require("../Utils/bcryptPassword.js");
const { generateToken } = require("../Utils/token.js");
const signupUser = async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (!name || !email || !phoneNumber || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match!" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long!" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address!" });
  }

  try {
    const existingUser = await prisma.users.findFirst({ where: { OR: [{ email }, { phoneNumber }] } });
    if (existingUser) {
      return res.status(400).json({ message: existingUser.email === email ? "Email already exists!" : "Phone number already exists!" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.users.create({
      data: { name, email, phoneNumber, password: hashedPassword },
    });

    const tokens = generateToken(newUser.id);
    res.cookie('token', tokens.accessTokens, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', maxAge: 24 * 60 * 60 * 1000 });
    return res.status(201).json({
      message: "User created successfully!",
      token: tokens.accessTokens,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    const fs = require('fs');
    fs.appendFileSync('error.log', new Date().toISOString() + ' - Signup Error: ' + err.stack + '\n');
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('\n=== LOGIN ATTEMPT ===');
  console.log('Email:', email);
  console.log('Time:', new Date().toISOString());

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required!" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address!" });
  }

  try {
    const user = await prisma.users.findFirst({ where: { email } });
    console.log('User found:', user ? 'Yes' : 'No');
    console.log('Full user object:', user);

    if (!user) {
      console.log('❌ LOGIN FAILED - User not found');
      console.log('===================\n');
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ LOGIN FAILED - Invalid password');
      console.log('===================\n');
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const tokens = generateToken(user.id);
    res.cookie('token', tokens.accessTokens, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    const responseObj = {
      message: "Login successful!",
      token: tokens.accessTokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileCompleted: user.profileCompleted || false
      }
    };

    console.log('✅ LOGIN SUCCESS');
    console.log('User ID:', user.id);
    console.log('User Name:', user.name);
    console.log('Response:', JSON.stringify(responseObj, null, 2));
    console.log('===================\n');

    return res.status(200).json(responseObj);
  } catch (err) {
    console.log('❌ LOGIN ERROR');
    console.error('Error details:', err);
    console.log('===================\n');
    return res.status(500).json({ message: "Server Error: " + err.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  return res.status(200).json({ message: "Logout successful!" });
};

const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, phoneNumber: true, age: true, gender: true, height: true, weight: true, fitnessGoal: true, activityLevel: true, profileCompleted: true }
    });

    return res.status(200).json({
      message: "Profile retrieved successfully!",
      user
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

const updateUserProfile = async (req, res) => {
  const { age, gender, height, weight, fitnessGoal, activityLevel } = req.body;

  try {
    const updatedUser = await prisma.users.update({
      where: { id: req.user.id },
      data: {
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        fitnessGoal,
        activityLevel,
        profileCompleted: true
      },
      select: { id: true, name: true, email: true, phoneNumber: true, age: true, gender: true, height: true, weight: true, fitnessGoal: true, activityLevel: true, profileCompleted: true }
    });

    return res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ message: "Server error during profile update!" });
  }
};

module.exports = { signupUser, loginUser, logoutUser, getUserProfile, updateUserProfile };
