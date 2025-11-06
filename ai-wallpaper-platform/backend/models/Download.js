const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wallpaper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallpaper',
    required: true
  },
  licenseType: {
    type: String,
    enum: ['personal', 'commercial'],
    required: true
  },
  subscriptionPlanAtDownload: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise']
  },
  ipAddress: String,
  userAgent: String,
  downloadUrl: String,
  fileSize: Number,
  format: String
}, {
  timestamps: true
});

// Indexes
downloadSchema.index({ user: 1, createdAt: -1 });
downloadSchema.index({ wallpaper: 1 });
downloadSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Download', downloadSchema);
