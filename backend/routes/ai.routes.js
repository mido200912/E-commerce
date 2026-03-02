const express = require('express');
const router = express.Router();
const { getAIResponse } = require('../controllers/ai.controller');

router.post('/chat', getAIResponse);

module.exports = router;
