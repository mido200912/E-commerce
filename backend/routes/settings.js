const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/auth.middleware');

// Public route - get settings
router.get('/', settingsController.getSettings);

// Admin routes - update and reset settings
router.put('/', protect, settingsController.updateSettings);
router.post('/reset', protect, settingsController.resetSettings);

module.exports = router;
