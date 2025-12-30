const express = require('express');
const router = express.Router();
const ChatLog = require('../models/ChatLog');
const { auth } = require('../middleware/auth');

router.get('/company/:id', auth, async (req, res) => {
  try {
    const companyId = req.params.id;
    
    const totalChats = await ChatLog.countDocuments({ companyId });
    const matchedChats = await ChatLog.countDocuments({ companyId, matched: true });
    const recentChats = await ChatLog.find({ companyId })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      totalChats,
      matchedChats,
      unmatchedChats: totalChats - matchedChats,
      matchRate: totalChats > 0 ? (matchedChats / totalChats * 100).toFixed(2) : 0,
      recentChats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;