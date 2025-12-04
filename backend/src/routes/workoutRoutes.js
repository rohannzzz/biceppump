const { createWorkout, getWorkouts, getWorkoutById, updateWorkout, deleteWorkout } = require("../controllers/workoutController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { Router } = require("express");

const router = Router();

router.post("/", authenticateToken, createWorkout);
router.get("/", authenticateToken, getWorkouts);
router.get("/:id", authenticateToken, getWorkoutById);
router.put("/:id", authenticateToken, updateWorkout);
router.delete("/:id", authenticateToken, deleteWorkout);

module.exports = router;