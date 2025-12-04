const prisma = require("../db/prisma.js");

// Get progress data for charts
const getProgressData = async (req, res) => {
    try {
        const { exercise } = req.query;
        const userId = req.user.id;

        // Get all workouts with exercises
        const workouts = await prisma.workouts.findMany({
            where: { userId },
            include: { exercises: true },
            orderBy: { createdAt: 'asc' }
        });

        // Process data for charts
        const progressData = [];
        const exerciseMap = new Map();

        workouts.forEach(workout => {
            workout.exercises.forEach(ex => {
                if (!exercise || ex.name.toLowerCase().includes(exercise.toLowerCase())) {
                    const key = ex.name;
                    if (!exerciseMap.has(key)) {
                        exerciseMap.set(key, []);
                    }

                    exerciseMap.get(key).push({
                        date: workout.createdAt,
                        weight: ex.weight || 0,
                        reps: ex.reps,
                        sets: ex.sets,
                        volume: (ex.weight || 0) * ex.reps * ex.sets
                    });
                }
            });
        });

        // Convert to array format
        exerciseMap.forEach((data, exerciseName) => {
            progressData.push({
                exercise: exerciseName,
                data: data
            });
        });

        return res.status(200).json({ progressData });
    } catch (error) {
        console.error('Progress data error:', error);
        return res.status(500).json({ message: "Server error!" });
    }
};

// Calculate and return Pump Score
const getPumpScore = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get workouts from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentWorkouts = await prisma.workouts.findMany({
            where: {
                userId,
                createdAt: { gte: thirtyDaysAgo }
            },
            include: { exercises: true }
        });

        // Calculate Pump Score
        let totalVolume = 0;
        let totalIntensity = 0;
        let workoutCount = recentWorkouts.length;

        recentWorkouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                const volume = (exercise.weight || 0) * exercise.reps * exercise.sets;
                totalVolume += volume;
                totalIntensity += (exercise.weight || 0);
            });
        });

        // Pump Score formula: (Volume * 0.4) + (Intensity * 0.3) + (Frequency * 0.3)
        const volumeScore = Math.min(totalVolume / 100, 100);
        const intensityScore = Math.min(totalIntensity / 10, 100);
        const frequencyScore = Math.min(workoutCount * 10, 100);

        const pumpScore = Math.round(
            (volumeScore * 0.4) + (intensityScore * 0.3) + (frequencyScore * 0.3)
        );

        // Update user's pump score
        await prisma.users.update({
            where: { id: userId },
            data: { pumpScore }
        });

        return res.status(200).json({
            pumpScore,
            breakdown: {
                volume: Math.round(volumeScore),
                intensity: Math.round(intensityScore),
                frequency: Math.round(frequencyScore),
                workoutCount
            }
        });
    } catch (error) {
        console.error('Pump score error:', error);
        return res.status(500).json({ message: "Server error!" });
    }
};

// Get personal records
const getPersonalRecords = async (req, res) => {
    try {
        const userId = req.user.id;

        const workouts = await prisma.workouts.findMany({
            where: { userId },
            include: { exercises: true }
        });

        // Find PRs for each exercise
        const prs = new Map();

        workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                const key = exercise.name;
                const current = prs.get(key);

                if (!current || (exercise.weight || 0) > (current.weight || 0)) {
                    prs.set(key, {
                        exercise: exercise.name,
                        weight: exercise.weight,
                        reps: exercise.reps,
                        sets: exercise.sets,
                        date: workout.createdAt,
                        muscleGroup: exercise.muscleGroup
                    });
                }
            });
        });

        const personalRecords = Array.from(prs.values());

        return res.status(200).json({ personalRecords });
    } catch (error) {
        console.error('Personal records error:', error);
        return res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { getProgressData, getPumpScore, getPersonalRecords };
