const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  wallpaperCount: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    default: 0
  },
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for better search performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Category', categorySchema);
