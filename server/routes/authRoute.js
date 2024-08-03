const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");
const { upload } = require("../middleware/multer.middleware");
const { handleUpload } = require("../storage/storage");


router.post("/register", upload.single("image"), handleUpload, register);
// router.post("/profile-pic",upload.single("image"), handleUpload, async (req, res) => {
// console.log(req.file.cloudinaryUrl);
//         res.status(200).json({ msg: "image uploaded successfully", url: imageUrl });

// });
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;