const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require('dotenv');
const pool = require("./dbConfig/conn");
const authRoute = require("./routes/authRoute");
const path = require("path");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/images', express.static(path.join(__dirname, "images")));
app.use("/api/auth", authRoute);

// for debugging the issue
app.use((req, res, next) => {
    console.log(`Request method: ${req.method}, Request url: ${req.url}`);
    next();
})

app.get('/', (req, res) => {
    console.log("This is a root or default port");
}) 

// error handling
app.use(notFound);
app.use(errorHandler);

// checking db connection
const checkDatabaseConnection = async() => {
    try {
        const client = await pool.connect();
        console.log("Database connected Successfully");
    } catch (error) {
        console.error("Database connection failed", error.message);
        process.exit(1);
    }
}

checkDatabaseConnection();

const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log(`Server started at port no: ${port}`);
})