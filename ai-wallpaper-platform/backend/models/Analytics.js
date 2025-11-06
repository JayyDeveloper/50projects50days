const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  metrics: {
    totalUsers: {
      type: Number,
      default: 0
    },
    newUsers: {
      type: Number,
      default: 0
    },
    activeSubscriptions: {
      type: Number,
      default: 0
    },
    totalDownloads: {
      type: Number,
      default: 0
    },
    totalViews: {
      type: Number,
      default: 0
    },
    revenue: {
      type: Number,
      default: 0
    },
    subscriptionsByPlan: {
      basic: { type: Number, default: 0 },
      pro: { type: Number, default: 0 },
      enterprise: { type: Number, default: 0 }
    }
  },
  topWallpapers: [{
    wallpaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallpaper'
    },
    downloads: Number,
    views: Number
  }],
  topCategories: [{
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    views: Number
  }]
}, {
  timestamps: true
});

analyticsSchema.index({ date: -1, type: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
