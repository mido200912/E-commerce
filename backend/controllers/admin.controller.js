const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { asyncHandler } = require('../middleware/errorHandler.middleware');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }

    // Check if admin exists (include password for comparison)
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Check if admin is active
    if (!admin.isActive) {
        return res.status(401).json({
            success: false,
            message: 'Account is deactivated'
        });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save({ validateBeforeSave: false });

    // Generate token
    const token = generateToken(admin._id);

    // Set cookie options
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    res.cookie('adminToken', token, cookieOptions);

    res.status(200).json({
        success: true,
        token,
        admin: {
            id: admin._id,
            email: admin.email,
            role: admin.role
        }
    });
});

// @desc    Admin logout
// @route   POST /api/admin/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
    res.cookie('adminToken', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @desc    Check authentication status
// @route   GET /api/admin/check
// @access  Private
exports.checkAuth = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        authenticated: true,
        admin: {
            id: req.admin._id,
            email: req.admin.email,
            role: req.admin.role
        }
    });
});

// @desc    Change password
// @route   PUT /api/admin/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Please provide current and new password'
        });
    }

    const admin = await Admin.findById(req.admin._id).select('+password');

    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Current password is incorrect'
        });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});
