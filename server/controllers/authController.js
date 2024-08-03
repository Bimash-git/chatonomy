const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../dbConfig/conn");
const { generateToken } = require("../dbConfig/generateToken");
// const { handleUpload } = require("../storage/storage")

const register = async (req, res) => {
    const { email, password } = req.body;
    const image = req.file ? req.file.cloudinaryUrl : '../images/default-avatar.jpg';
    // const image = req.body.file ? req.file.cloudinaryUrl : '../images/default-avatar.jpg';

    // form validation
    if (!email || !password) {
        res.status(400);
        throw new Error("please enter all the fields");
    }

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: "User already exists with that email id" });
        }

        // function which uploades image to cloudinary if it exists
        // let imageUrl = req.file ? await handleUpload(req.file) : "../images/default-avatar.jpg";

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query('INSERT INTO users(email, password, image) VALUES ($1, $2, $3) RETURNING *', [email, hashPassword, image]);

        // debugging new user
        console.log("New User: ", newUser);

        if (newUser.rows.length === 0) {
            throw new Error("failed to insert new user");
        }

        // generating JWT token
        const token = generateToken(newUser.rows[0]);
        console.log("Generated token is:  ",token);

        // setting token in HTTP ONLY cookie
        res.cookie("token", token, { httpOnly: true, sameSite: "Strict" })
        res.json({ user: newUser.rows[0] });

    } catch (error) {
        console.error("Error =>  ", error.message);
        res.status(500).send('Server Error');
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ msg: "Invalid email id" });
        }

        const isMatch = await bcrypt.compare(password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ msg: "invalid password" });
        }

        // generating token JWT
        const token = generateToken(user.rows[0]);
        console.log("Generated token is:  ",token);

        // setting token in http only cookie
        res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });

        res.json({ user: user.rows[0] });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

const logout = async(req, res) => {
    res.clearCookie("token").staus(200).json({ message: "Successfully logged out"});
}

module.exports = { register, login, logout };
