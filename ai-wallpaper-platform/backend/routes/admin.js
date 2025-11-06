const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getPendingWallpapers,
  approveWallpaper,
  rejectWallpaper,
  getUsers,
  updateUserRole,
  toggleUserStatus,
  getAnalytics,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect, authorize('admin'));

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

// Wallpaper management
router.get('/wallpapers/pending', getPendingWallpapers);
router.put('/wallpapers/:id/approve', approveWallpaper);
router.put('/wallpapers/:id/reject', rejectWallpaper);

// User management
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/status', toggleUserStatus);

// Category management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
