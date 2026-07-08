const fs = require('fs');
const path = require('path');
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const env = require('../config/env');

const isCloudinaryConfigured = !!(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);

const createError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const uploadFile = async (file) => {
    if (!file || !file.buffer) {
        throw createError(400, "File is required");
    }

    if (!isCloudinaryConfigured) {
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname || '');
        const filename = uniqueSuffix + fileExt;
        const filePath = path.join(uploadsDir, filename);

        await fs.promises.writeFile(filePath, file.buffer);

        const fileUrl = `http://localhost:${env.port}/uploads/${filename}`;

        return {
            secure_url: fileUrl,
            url: fileUrl,
            public_id: filename,
            original_filename: file.originalname,
        };
    }

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

const deleteFile = async (publicId, resourceType = "image") => {
    if (!publicId) {
        throw createError(400, "Public ID is required");
    }

    if (!isCloudinaryConfigured) {
        const uploadsDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadsDir, publicId);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("Failed to delete local file:", err);
            }
        }
        return { result: "ok" };
    }

    return cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
    });
};

module.exports = {
    uploadFile,
    deleteFile,
};