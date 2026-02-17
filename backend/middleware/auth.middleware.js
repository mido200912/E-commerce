const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie or Authorization header
        if (req.cookies.adminToken) {
            token = req.cookies.adminToken;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if admin still exists and is active
            const admin = await Admin.findById(decoded.id);

            if (!admin || !admin.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Admin account is no longer active'
                });
            }

            // Attach admin to request
            req.admin = admin;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        next(error);
    }
};

// Restrict to specific roles
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }
        next();
    };
};
