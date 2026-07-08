const uploadService = require('../services/upload.service');

const uploadAsset = async (req, res) => {
	const file = req.file || (Array.isArray(req.files) ? req.files[0] : undefined);
	const result = await uploadService.uploadFile(file);

	res.status(201).json({
		success: true,
		message: 'File uploaded successfully',
		data: result,
	});
};

const deleteAsset = async (req, res) => {
	const publicId = req.body?.publicId || req.params.publicId;
	const resourceType = req.body?.resourceType || req.body?.type || 'image';

	const result = await uploadService.deleteFile(publicId, resourceType);

	res.status(200).json({
		success: true,
		message: 'File deleted successfully',
		data: result,
	});
};

module.exports = {
	uploadAsset,
	deleteAsset,
};
