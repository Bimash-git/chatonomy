const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // const token = req.header('x-auth-token');
    const token = req.cookies.token;

    if(!token) {
        res.status(401).json({ msg: "No token found, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" })
    }

}