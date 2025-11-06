const mongoose = require('mongoose');

const wallpaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
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
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  images: {
    thumbnail: {
      url: String,
      width: Number,
      height: Number,
      size: Number
    },
    preview: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      watermarked: {
        type: Boolean,
        default: true
      }
    },
    original: {
      url: String,
      width: Number,
      height: Number,
      size: Number,
      format: String
    }
  },
  aiModel: {
    name: {
      type: String,
      required: true
    },
    version: String,
    parameters: mongoose.Schema.Types.Mixed
  },
  artist: {
    name: String,
    website: String,
    attribution: String
  },
  copyright: {
    owner: {
      type: String,
      required: true
    },
    license: {
      type: String,
      enum: ['personal', 'commercial', 'both'],
      default: 'both'
    },
    attributionRequired: {
      type: Boolean,
      default: false
    },
    customTerms: String
  },
  pricing: {
    requiresSubscription: {
      type: Boolean,
      default: true
    },
    minimumPlan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'basic'
    }
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  seoMetadata: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  exifData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

// Indexes for better query performance
wallpaperSchema.index({ slug: 1 });
wallpaperSchema.index({ status: 1, isActive: 1 });
wallpaperSchema.index({ categories: 1, status: 1 });
wallpaperSchema.index({ tags: 1 });
wallpaperSchema.index({ featured: -1, createdAt: -1 });
wallpaperSchema.index({ 'stats.downloads': -1 });
wallpaperSchema.index({ 'stats.favorites': -1 });

// Text index for search
wallpaperSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for average rating
wallpaperSchema.virtual('averageRating').get(function() {
  if (this.stats.ratingCount === 0) return 0;
  return (this.stats.rating / this.stats.ratingCount).toFixed(1);
});

module.exports = mongoose.model('Wallpaper', wallpaperSchema);
