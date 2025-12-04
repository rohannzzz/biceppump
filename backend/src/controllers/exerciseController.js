const prisma = require("../db/prisma.js");

// CREATE
const createExercise = async (req, res) => {
  const { name, sets, reps, weight, workoutId, muscleGroup } = req.body;

  if (!name || !sets || !reps || !workoutId) {
    return res.status(400).json({ message: "Name, sets, reps, and workoutId are required!" });
  }

  try {
    const workout = await prisma.workouts.findFirst({
      where: { id: parseInt(workoutId), userId: req.user.id }
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found!" });
    }

    const exercise = await prisma.exercises.create({
      data: {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        muscleGroup: muscleGroup || null,
        workoutId: parseInt(workoutId)
      }
    });

    return res.status(201).json({
      message: "Exercise created successfully!",
      exercise
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// READ
const getExercises = async (req, res) => {
  const { workoutId } = req.params;

  try {
    const exercises = await prisma.exercises.findMany({
      where: { workoutId: parseInt(workoutId) },
      orderBy: { createdAt: 'asc' }
    });

    return res.status(200).json({ exercises });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// UPDATE
const updateExercise = async (req, res) => {
  const { id } = req.params;
  const { name, sets, reps, weight, muscleGroup } = req.body;

  try {
    const exercise = await prisma.exercises.update({
      where: { id: parseInt(id) },
      data: {
        name,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        muscleGroup: muscleGroup || null
      }
    });

    return res.status(200).json({
      message: "Exercise updated successfully!",
      exercise
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

// DELETE
const deleteExercise = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.exercises.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: "Exercise deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
};

module.exports = { createExercise, getExercises, updateExercise, deleteExercise };