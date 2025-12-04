const prisma = require("../db/prisma.js");

// Get leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count
        const total = await prisma.users.count();

        // Get users sorted by pump score
        const users = await prisma.users.findMany({
            select: {
                id: true,
                name: true,
                pumpScore: true,
                createdAt: true
            },
            orderBy: { pumpScore: 'desc' },
            skip,
            take: limit
        });

        // Add rank to each user
        const leaderboard = users.map((user, index) => ({
            rank: skip + index + 1,
            ...user
        }));

        return res.status(200).json({
            leaderboard,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { getLeaderboard };
