const { getProgressData, getPumpScore, getPersonalRecords } = require("../controllers/analyticsController.js");
const { authenticateToken } = require("../middleware/auth.js");
const { Router } = require("express");

const router = Router();

router.get("/progress", authenticateToken, getProgressData);
router.get("/pump-score", authenticateToken, getPumpScore);
router.get("/prs", authenticateToken, getPersonalRecords);

module.exports = router;
