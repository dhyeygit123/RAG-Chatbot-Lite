const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

qaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

qaSchema.index({ companyId: 1, question: 'text', answer: 'text' });

module.exports = mongoose.model('QA', qaSchema);