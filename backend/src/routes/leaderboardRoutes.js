const { getLeaderboard } = require("../controllers/leaderboardController.js");
const { Router } = require("express");

const router = Router();

router.get("/", getLeaderboard);

module.exports = router;
