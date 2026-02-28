const express = require('express');
const router = express.Router();
const { trackVisit, getDashboardStats } = require('../controllers/analytics.controller');
const { protect } = require('../middleware/auth.middleware');

// Public route to track visits
router.post('/visit', trackVisit);

// Protected admin route to get stats
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
