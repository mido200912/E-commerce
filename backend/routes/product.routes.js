const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validation rules
const productValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Product title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Product description is required')
        .isLength({ max: 2000 })
        .withMessage('Description cannot exceed 2000 characters'),
    body('collection')
        .notEmpty()
        .withMessage('Collection is required')
        .isMongoId()
        .withMessage('Invalid collection ID'),
    body('price')
        .isFloat({ min: 0, max: 1000000 })
        .withMessage('Price must be between 0 and 1,000,000'),
    body('images')
        .optional()
        .isArray()
        .withMessage('Images must be an array'),
    body('images.*')
        .optional()
        .isURL()
        .withMessage('Each image must be a valid URL'),
    body('sizes')
        .optional()
        .isArray()
        .withMessage('Sizes must be an array'),
    body('colors')
        .optional()
        .isArray()
        .withMessage('Colors must be an array')
];

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', protect, productValidation, validate, createProduct);
router.put('/:id', protect, productValidation, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
