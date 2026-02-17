const { validationResult } = require('express-validator');

// Handle validation errors
exports.validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const extractedErrors = errors.array().map(err => ({
            field: err.param,
            message: err.msg
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: extractedErrors
        });
    }

    next();
};

// Sanitize user input - prevent NoSQL injection
exports.sanitizeInput = (req, res, next) => {
    // Remove any keys that start with $ or contain .
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;

        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }

        const sanitized = {};
        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                continue; // Skip dangerous keys
            }
            sanitized[key] = sanitize(obj[key]);
        }
        return sanitized;
    };

    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);

    next();
};
