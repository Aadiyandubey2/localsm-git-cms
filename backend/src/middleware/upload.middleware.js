const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
        return cb(null, true);
    }

    return cb(new Error("Only image files are allowed"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
});

module.exports = upload;