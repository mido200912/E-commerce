const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    login,
    logout,
    checkAuth,
    changePassword
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

// Validation rules
const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/login', loginValidation, validate, login);
router.post('/logout', logout);
router.get('/check', protect, checkAuth);
router.put('/change-password', protect, changePasswordValidation, validate, changePassword);

module.exports = router;
