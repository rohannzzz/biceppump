const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    const payload = { userId };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    return { accessToken, refreshToken };
};

const verifyTokens = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Token verification failed:', err.message);
        }
        return null;
    }
};

module.exports = { generateToken, verifyTokens };