const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getAllCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection
} = require('../controllers/collection.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validation rules
const collectionValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Collection name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
];

// Public routes
router.get('/', getAllCollections);
router.get('/:id', getCollection);

// Protected routes
router.post('/', protect, collectionValidation, validate, createCollection);
router.put('/:id', protect, collectionValidation, validate, updateCollection);
router.delete('/:id', protect, deleteCollection);

module.exports = router;
