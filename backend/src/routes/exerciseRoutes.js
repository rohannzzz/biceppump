const { createExercise, getExercises, updateExercise, deleteExercise } = require("../controllers/exerciseController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { Router } = require("express");

const router = Router();

router.post("/", authenticateToken, createExercise);
router.get("/:workoutId", authenticateToken, getExercises);
router.put("/:id", authenticateToken, updateExercise);
router.delete("/:id", authenticateToken, deleteExercise);

module.exports = router;