const prisma = require("../db/prisma.js");

// CREATE
const createWorkout = async (req, res) => {
  const { name, description, duration } = req.body;

  try {
    const workout = await prisma.workouts.create({
      data: {
        name,
        description,
        duration: duration ? parseInt(duration) : null,
        userId: req.user.id
      }
    });

    return res.status(201).json({
      message: "Workout created successfully!",
      workout
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// READ
const getWorkouts = async (req, res) => {
  try {
    const { page = 1, limit = 10, muscleGroup, startDate, endDate, sortBy = 'date', order = 'desc' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = { userId: req.user.id };

    // Date filtering
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Muscle group filtering (filter exercises)
    const includeClause = { exercises: true };
    if (muscleGroup) {
      includeClause.exercises = {
        where: { muscleGroup }
      };
    }

    // Build orderBy clause
    let orderBy = { createdAt: order };
    if (sortBy === 'name') {
      orderBy = { name: order };
    }

    // Get total count
    const total = await prisma.workouts.count({ where });

    // Get workouts
    const workouts = await prisma.workouts.findMany({
      where,
      include: includeClause,
      orderBy,
      skip,
      take: parseInt(limit)
    });

    return res.status(200).json({
      workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    return res.status(500).json({ message: "Server error!" });
  }
};

// UPDATE
const updateWorkout = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration } = req.body;

  try {
    const workout = await prisma.workouts.updateMany({
      where: { id: parseInt(id), userId: req.user.id },
      data: {
        name,
        description,
        duration: duration ? parseInt(duration) : null
      }
    });

    if (workout.count === 0) {
      return res.status(404).json({ message: "Workout not found!" });
    }

    return res.status(200).json({
      message: "Workout updated successfully!"
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// DELETE
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await prisma.workouts.deleteMany({
      where: { id: parseInt(id), userId: req.user.id }
    });

    if (result.count === 0) {
      return res.status(404).json({ message: "Workout not found!" });
    }

    return res.status(200).json({ message: "Workout deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// GET SINGLE WORKOUT
const getWorkoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await prisma.workouts.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      },
      include: { exercises: true }
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found!" });
    }

    return res.status(200).json({ workout });
  } catch (error) {
    console.error('Get workout error:', error);
    return res.status(500).json({ message: "Server error!" });
  }
};

module.exports = { createWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkout };