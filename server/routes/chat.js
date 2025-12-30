const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Public routes (no auth needed)
router.post('/query', chatController.query);
router.get('/settings/:embedKey', chatController.getSettings);

module.exports = router;