const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  sourceType: {
    type: String,
    enum: ['website', 'telegram', 'vk', 'max'],
    required: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы для быстрого поиска
newsSchema.index({ title: 'text', content: 'text' });
newsSchema.index({ keywords: 1 });
newsSchema.index({ sourceType: 1 });
newsSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('News', newsSchema);
