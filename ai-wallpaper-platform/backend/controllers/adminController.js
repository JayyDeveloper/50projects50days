const Wallpaper = require('../models/Wallpaper');
const User = require('../models/User');
const Category = require('../models/Category');
const Download = require('../models/Download');
const Analytics = require('../models/Analytics');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    // Get total counts
    const [
      totalUsers,
      totalWallpapers,
      totalDownloads,
      activeSubscriptions,
      pendingWallpapers
    ] = await Promise.all([
      User.countDocuments(),
      Wallpaper.countDocuments({ status: 'approved' }),
      Download.countDocuments(),
      User.countDocuments({
        'subscription.status': 'active',
        'subscription.plan': { $ne: 'free' }
      }),
      Wallpaper.countDocuments({ status: 'pending' })
    ]);

    // Get new users this month
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get downloads this month
    const recentDownloads = await Download.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get top wallpapers
    const topWallpapers = await Wallpaper.find({ status: 'approved' })
      .sort('-stats.downloads')
      .limit(10)
      .select('title slug stats images.thumbnail');

    // Get subscription breakdown
    const subscriptionBreakdown = await User.aggregate([
      {
        $match: {
          'subscription.status': 'active'
        }
      },
      {
        $group: {
          _id: '$subscription.plan',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalWallpapers,
          totalDownloads,
          activeSubscriptions,
          pendingWallpapers,
          newUsersThisMonth: newUsers,
          downloadsThisMonth: recentDownloads
        },
        topWallpapers,
        subscriptionBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all pending wallpapers for review
 * @route   GET /api/admin/wallpapers/pending
 * @access  Private/Admin
 */
exports.getPendingWallpapers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const wallpapers = await Wallpaper.find({ status: 'pending' })
      .populate('categories', 'name slug')
      .populate('uploadedBy', 'name email')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Wallpaper.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      data: {
        wallpapers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve wallpaper
 * @route   PUT /api/admin/wallpapers/:id/approve
 * @access  Private/Admin
 */
exports.approveWallpaper = async (req, res, next) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    wallpaper.status = 'approved';
    wallpaper.approvedBy = req.user._id;
    wallpaper.approvedAt = new Date();
    await wallpaper.save();

    res.json({
      success: true,
      message: 'Wallpaper approved successfully',
      data: { wallpaper }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject wallpaper
 * @route   PUT /api/admin/wallpapers/:id/reject
 * @access  Private/Admin
 */
exports.rejectWallpaper = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    wallpaper.status = 'rejected';
    wallpaper.rejectionReason = reason;
    await wallpaper.save();

    res.json({
      success: true,
      message: 'Wallpaper rejected',
      data: { wallpaper }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with filtering
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      role,
      subscriptionPlan,
      search
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (subscriptionPlan) query['subscription.plan'] = subscriptionPlan;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deactivate/activate user
 * @route   PUT /api/admin/users/:id/status
 * @access  Private/Admin
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get analytics data
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = async (req, res, next) => {
  try {
    const { type = 'daily', startDate, endDate } = req.query;

    const query = { type };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const analytics = await Analytics.find(query)
      .populate('topWallpapers.wallpaper', 'title slug images.thumbnail')
      .populate('topCategories.category', 'name slug')
      .sort('-date')
      .limit(30);

    res.json({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/update category
 * @route   POST /api/admin/categories
 * @access  Private/Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/admin/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/admin/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has wallpapers
    const wallpaperCount = await Wallpaper.countDocuments({
      categories: category._id
    });

    if (wallpaperCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${wallpaperCount} wallpapers. Please reassign them first.`
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
