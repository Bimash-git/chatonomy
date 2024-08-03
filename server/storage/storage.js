    const cloudinary = require("cloudinary").v2;;
    // const { log } = require("console");
    const fs = require("fs");

    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    });

    async function handleUpload(req, res, next) {

        if (!req.file) {
            // return next(new Error("No file provided"));
            req.file = {
                cloudinaryUrl: "../images/default-avatar.jpg"
            }
            return next();
        }
        try {
            //uploading file in cloudinary
            const res = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto",
                folder: "profile_pics"
            });
            req.file.cloudinaryUrl = res.secure_url;
            fs.unlinkSync(req.file.path);
            // console.log("cloudinary URL: ", req.file.cloudinaryUrl);
            // next();

            console.log("file successfully uploaded on cloudinary: ", res.url);
            // return res;

        } catch (error) {
            fs.unlinkSync(file.path); // removes the locally saved temp file if upload operation fails
            console.error("Error uploading to cloudinary: ", error);
            return next(error);
        }

    }

    module.exports = { handleUpload };