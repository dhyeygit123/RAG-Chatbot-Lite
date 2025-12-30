const mongoose = require('mongoose');
const crypto = require('crypto');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  settings: {
    botName: {
      type: String,
      default: 'Support Bot'
    },
    welcomeMessage: {
      type: String,
      default: 'Hi! How can I help you today?'
    },
    themeColor: {
      type: String,
      default: '#3b82f6'
    },
    avatarUrl: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      enum: ['left', 'right'],
      default: 'right'
    }
  },
  embedKey: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

companySchema.pre('save', function(next) {
  if (!this.embedKey) {
    this.embedKey = crypto.randomBytes(16).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);