    const jwt = require("jsonwebtoken");

    const generateToken = (user) => {
        const payload = {
            user: {
                id: user.user_id,
                email: user.email
            }
        }

        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h"});
    }

    module.exports = { generateToken }