const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { hasCloudinaryConfig } = require("../cloudConfig");

const uploadsDirectory = path.join(__dirname, "..", "public", "uploads");
fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = hasCloudinaryConfig
    ? multer.memoryStorage()
    : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadsDirectory);
        },
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname);
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
            cb(null, uniqueName);
        },
    });

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    const error = new Error("Only image files are allowed.");
    error.status = 400;
    cb(error);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});
