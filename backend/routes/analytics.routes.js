const express = require('express');
const router = express.Router();
const { trackVisit, getDashboardStats } = require('../controllers/analytics.controller');

// Public route to track visits
router.post('/visit', trackVisit);

// Protected admin route to get stats
router.get('/dashboard', getDashboardStats);

module.exports = router;
