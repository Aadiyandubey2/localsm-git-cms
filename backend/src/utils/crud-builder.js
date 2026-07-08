const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');

function makeCrudRouter(Model, name) {
	const router = express.Router();

	// Get List or Single Document (if single config)
	router.get('/', async (req, res, next) => {
		try {
			const items = await Model.find();
			const isSingleDocument = name.endsWith('Document') || name.endsWith('Settings');
			if (isSingleDocument) {
				let doc = items[0];
				if (!doc) {
					doc = await Model.create({ isActive: true });
				}
				return res.status(200).json({ success: true, data: doc });
			}
			res.status(200).json({ success: true, data: items });
		} catch (error) {
			next(error);
		}
	});

	// Get by ID
	router.get('/:id', async (req, res, next) => {
		try {
			const item = await Model.findById(req.params.id);
			if (!item) {
				return res.status(404).json({ success: false, message: `${name} not found` });
			}
			res.status(200).json({ success: true, data: item });
		} catch (error) {
			next(error);
		}
	});

	// Create
	router.post('/', authMiddleware.protect, async (req, res, next) => {
		try {
			const item = await Model.create(req.body);
			res.status(201).json({ success: true, message: `${name} created successfully`, data: item });
		} catch (error) {
			next(error);
		}
	});

	// Update
	const updateHandler = async (req, res, next) => {
		try {
			const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!item) {
				return res.status(404).json({ success: false, message: `${name} not found` });
			}
			res.status(200).json({ success: true, message: `${name} updated successfully`, data: item });
		} catch (error) {
			next(error);
		}
	};
	router.put('/:id', authMiddleware.protect, updateHandler);
	router.patch('/:id', authMiddleware.protect, updateHandler);

	// Delete
	router.delete('/:id', authMiddleware.protect, async (req, res, next) => {
		try {
			const item = await Model.findByIdAndDelete(req.params.id);
			if (!item) {
				return res.status(404).json({ success: false, message: `${name} not found` });
			}
			res.status(200).json({ success: true, message: `${name} deleted successfully` });
		} catch (error) {
			next(error);
		}
	});

	return router;
}

module.exports = makeCrudRouter;
