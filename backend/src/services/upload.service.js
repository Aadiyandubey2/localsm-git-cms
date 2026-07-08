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

// Helper to make GitHub REST API requests
const gitHubRequest = async (method, relativePath, body = null) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repo) {
    return null;
  }

  const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${branch}`;
  
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'LocalSM-CMS-Upload-Service'
  };

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, options);
  
  if (!res.ok) {
    if (res.status === 404 && method === 'GET') {
      return null;
    }
    const errText = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${errText}`);
  }

  return res.json();
};

const uploadFile = async (file) => {
    if (!file || !file.buffer) {
        throw createError(400, "File is required");
    }

    if (!isCloudinaryConfigured) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExt = path.extname(file.originalname || '');
        const filename = uniqueSuffix + fileExt;
        const relativePath = `backend/uploads/${filename}`;

        if (process.env.VERCEL) {
            // Write to GitHub CMS in Vercel production environment
            const token = process.env.GITHUB_TOKEN;
            const repo = process.env.GITHUB_REPO;
            if (!token || !repo) {
                throw createError(400, "Git-based CMS Configuration Error: GITHUB_TOKEN and GITHUB_REPO must be set in Vercel to support file uploads without Cloudinary.");
            }

            try {
                const body = {
                    message: `Upload media: ${filename}`,
                    content: file.buffer.toString('base64')
                };
                await gitHubRequest('PUT', relativePath, body);
                console.log(`[GitHubDB] Successfully uploaded media ${filename} to GitHub.`);
            } catch (e) {
                console.error(`[GitHubDB] Failed to upload media ${filename} to GitHub:`, e.message);
                throw createError(500, `GitHub CMS upload failed: ${e.message}`);
            }
        } else {
            // Local file write
            const uploadsDir = path.join(__dirname, '../../uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const filePath = path.join(uploadsDir, filename);
            await fs.promises.writeFile(filePath, file.buffer);
        }

        const fileUrl = `/uploads/${filename}`;

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
        if (process.env.VERCEL) {
            const token = process.env.GITHUB_TOKEN;
            const repo = process.env.GITHUB_REPO;
            if (token && repo) {
                try {
                    const relativePath = `backend/uploads/${publicId}`;
                    const fileData = await gitHubRequest('GET', relativePath);
                    if (fileData && fileData.sha) {
                        await gitHubRequest('DELETE', relativePath, {
                            message: `Delete media: ${publicId}`,
                            sha: fileData.sha
                        });
                        console.log(`[GitHubDB] Successfully deleted media ${publicId} from GitHub.`);
                    }
                } catch (e) {
                    console.error(`[GitHubDB] Failed to delete media ${publicId} from GitHub:`, e.message);
                }
            }
        } else {
            const uploadsDir = path.join(__dirname, '../../uploads');
            const filePath = path.join(uploadsDir, publicId);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                } catch (err) {
                    console.error("Failed to delete local file:", err);
                }
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
