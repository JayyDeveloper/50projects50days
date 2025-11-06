const express = require('express');
const router = express.Router();
const {
  getAllWallpapers,
  getWallpaper,
  downloadWallpaper,
  toggleFavorite,
  createWallpaper,
  updateWallpaper,
  deleteWallpaper,
  getFeaturedWallpapers
} = require('../controllers/wallpaperController');
const { protect, authorize, requireSubscription, optionalAuth } = require('../middleware/auth');
const { downloadLimiter, searchLimiter } = require('../middleware/rateLimiter');

// Public routes (with optional auth)
router.get('/', optionalAuth, searchLimiter, getAllWallpapers);
router.get('/featured', getFeaturedWallpapers);
router.get('/:slug', optionalAuth, getWallpaper);

// Protected routes
router.post('/:id/download', protect, requireSubscription('basic'), downloadLimiter, downloadWallpaper);
router.post('/:id/favorite', protect, toggleFavorite);

// Admin routes
router.post('/', protect, authorize('admin'), createWallpaper);
router.put('/:id', protect, authorize('admin'), updateWallpaper);
router.delete('/:id', protect, authorize('admin'), deleteWallpaper);

module.exports = router;
