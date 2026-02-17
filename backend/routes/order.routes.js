const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    getOrderPDF,
    calculateShipping
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validation rules
const orderValidation = [
    body('customerName')
        .trim()
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
        .trim()
        .matches(/^01[0-2,5]{1}[0-9]{8}$/)
        .withMessage('Please provide a valid Egyptian phone number'),
    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Address must be between 10 and 500 characters'),
    body('governorate')
        .isIn(['القاهرة', 'الجيزة', 'القاهرة الجديدة', 'الإسكندرية', 'الدلتا', 'الصعيد'])
        .withMessage('Invalid governorate'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.product')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1, max: 100 })
        .withMessage('Quantity must be between 1 and 100'),
    body('paymentMethod')
        .isIn(['vodafone-cash', 'cash-on-delivery'])
        .withMessage('Invalid payment method')
];

const updateStatusValidation = [
    body('status')
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Invalid order status')
];

// Public routes
router.post('/', orderValidation, validate, createOrder);
router.post('/calculate-shipping', calculateShipping);

// Protected routes
router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, updateStatusValidation, validate, updateOrderStatus);
router.delete('/:id', protect, deleteOrder);
router.get('/:id/pdf', protect, getOrderPDF);

module.exports = router;
