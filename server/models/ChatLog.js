const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userMessage: {
    type: String,
    required: true
  },
  botResponse: {
    type: String,
    required: true
  },
  matched: {
    type: Boolean,
    default: false
  },
  usedAI: {
    type: Boolean,
    default: false
  },
  qaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QA',
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

chatLogSchema.index({ companyId: 1, timestamp: -1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);