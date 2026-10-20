const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['website', 'telegram', 'vk', 'max'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastParsed: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Source', sourceSchema);
