const { signupUser, loginUser, logoutUser, getUserProfile, updateUserProfile } = require("../controllers/authController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { Router } = require("express");

const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/profile", authenticateToken, getUserProfile)
router.put("/profile", authenticateToken, updateUserProfile)

module.exports = router;