const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../images");
    },
    filename: function (req, res, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.filename + '-' + uniqueSuffix);
    }
})

const upload = multer({ storage });

module.exports = { upload };