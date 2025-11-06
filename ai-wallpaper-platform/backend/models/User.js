const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: function() {
      return this.authProvider === 'local';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'trial'],
      default: 'trial'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallpaper'
  }],
  downloadHistory: [{
    wallpaper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallpaper'
    },
    downloadedAt: {
      type: Date,
      default: Date.now
    },
    license: {
      type: String,
      enum: ['personal', 'commercial']
    }
  }],
  newsletterSubscribed: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has active subscription
userSchema.methods.hasActiveSubscription = function() {
  if (this.subscription.plan === 'free') return false;
  if (this.subscription.status !== 'active' && this.subscription.status !== 'trial') return false;
  if (this.subscription.currentPeriodEnd && new Date() > this.subscription.currentPeriodEnd) return false;
  return true;
};

// Method to check download permissions
userSchema.methods.canDownloadOriginal = function() {
  return this.hasActiveSubscription() || this.subscription.plan !== 'free';
};

module.exports = mongoose.model('User', userSchema);
