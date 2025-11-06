const Wallpaper = require('../models/Wallpaper');
const Download = require('../models/Download');
const Category = require('../models/Category');
const imageProcessor = require('../utils/imageProcessor');

/**
 * @desc    Get all wallpapers with filtering, sorting, pagination
 * @route   GET /api/wallpapers
 * @access  Public
 */
exports.getAllWallpapers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 24,
      category,
      tags,
      featured,
      sort = '-createdAt',
      search
    } = req.query;

    // Build query
    const query = {
      status: 'approved',
      isActive: true
    };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.categories = cat._id;
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query
    const wallpapers = await Wallpaper.find(query)
      .populate('categories', 'name slug color')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count
    const count = await Wallpaper.countDocuments(query);

    // If user is authenticated, check favorites
    if (req.user) {
      wallpapers.forEach(wallpaper => {
        wallpaper.isFavorited = req.user.favorites.some(
          fav => fav.toString() === wallpaper._id.toString()
        );
      });
    }

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
 * @desc    Get single wallpaper by slug
 * @route   GET /api/wallpapers/:slug
 * @access  Public
 */
exports.getWallpaper = async (req, res, next) => {
  try {
    const wallpaper = await Wallpaper.findOne({
      slug: req.params.slug,
      status: 'approved',
      isActive: true
    })
      .populate('categories', 'name slug color')
      .populate('uploadedBy', 'name avatar');

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    // Increment view count
    wallpaper.stats.views += 1;
    await wallpaper.save();

    // Check if user can download original
    let canDownloadOriginal = false;
    let isFavorited = false;

    if (req.user) {
      canDownloadOriginal = req.user.canDownloadOriginal();
      isFavorited = req.user.favorites.some(
        fav => fav.toString() === wallpaper._id.toString()
      );
    }

    res.json({
      success: true,
      data: {
        wallpaper,
        canDownloadOriginal,
        isFavorited
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Download wallpaper
 * @route   POST /api/wallpapers/:id/download
 * @access  Private (with subscription)
 */
exports.downloadWallpaper = async (req, res, next) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    // Check if user can download
    if (!req.user.canDownloadOriginal()) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required to download originals',
        currentPlan: req.user.subscription.plan
      });
    }

    // Check license requirements
    const { licenseType = 'personal' } = req.body;

    if (licenseType === 'commercial' && wallpaper.copyright.license === 'personal') {
      return res.status(403).json({
        success: false,
        message: 'Commercial license not available for this wallpaper'
      });
    }

    // Create download record
    const download = await Download.create({
      user: req.user._id,
      wallpaper: wallpaper._id,
      licenseType,
      subscriptionPlanAtDownload: req.user.subscription.plan,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      downloadUrl: wallpaper.images.original.url,
      fileSize: wallpaper.images.original.size,
      format: wallpaper.images.original.format
    });

    // Update wallpaper stats
    wallpaper.stats.downloads += 1;
    await wallpaper.save();

    // Add to user's download history
    req.user.downloadHistory.push({
      wallpaper: wallpaper._id,
      license: licenseType
    });
    await req.user.save();

    res.json({
      success: true,
      message: 'Download initiated',
      data: {
        downloadUrl: wallpaper.images.original.url,
        filename: `${wallpaper.slug}.${wallpaper.images.original.format}`,
        license: licenseType,
        copyright: wallpaper.copyright
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle favorite wallpaper
 * @route   POST /api/wallpapers/:id/favorite
 * @access  Private
 */
exports.toggleFavorite = async (req, res, next) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    const favoriteIndex = req.user.favorites.indexOf(wallpaper._id);
    let isFavorited;

    if (favoriteIndex > -1) {
      // Remove from favorites
      req.user.favorites.splice(favoriteIndex, 1);
      wallpaper.stats.favorites -= 1;
      isFavorited = false;
    } else {
      // Add to favorites
      req.user.favorites.push(wallpaper._id);
      wallpaper.stats.favorites += 1;
      isFavorited = true;
    }

    await req.user.save();
    await wallpaper.save();

    res.json({
      success: true,
      message: isFavorited ? 'Added to favorites' : 'Removed from favorites',
      data: { isFavorited }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new wallpaper (Admin)
 * @route   POST /api/wallpapers
 * @access  Private/Admin
 */
exports.createWallpaper = async (req, res, next) => {
  try {
    const wallpaperData = {
      ...req.body,
      uploadedBy: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    };

    // If approved immediately, set approval details
    if (wallpaperData.status === 'approved') {
      wallpaperData.approvedBy = req.user._id;
      wallpaperData.approvedAt = new Date();
    }

    const wallpaper = await Wallpaper.create(wallpaperData);

    // Update category wallpaper count
    if (wallpaper.categories && wallpaper.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: wallpaper.categories } },
        { $inc: { wallpaperCount: 1 } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Wallpaper created successfully',
      data: { wallpaper }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update wallpaper
 * @route   PUT /api/wallpapers/:id
 * @access  Private/Admin
 */
exports.updateWallpaper = async (req, res, next) => {
  try {
    let wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    // Check ownership or admin
    if (wallpaper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this wallpaper'
      });
    }

    wallpaper = await Wallpaper.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Wallpaper updated successfully',
      data: { wallpaper }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete wallpaper
 * @route   DELETE /api/wallpapers/:id
 * @access  Private/Admin
 */
exports.deleteWallpaper = async (req, res, next) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id);

    if (!wallpaper) {
      return res.status(404).json({
        success: false,
        message: 'Wallpaper not found'
      });
    }

    // Check ownership or admin
    if (wallpaper.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this wallpaper'
      });
    }

    // Update category counts
    if (wallpaper.categories && wallpaper.categories.length > 0) {
      await Category.updateMany(
        { _id: { $in: wallpaper.categories } },
        { $inc: { wallpaperCount: -1 } }
      );
    }

    await wallpaper.deleteOne();

    res.json({
      success: true,
      message: 'Wallpaper deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured wallpapers
 * @route   GET /api/wallpapers/featured
 * @access  Public
 */
exports.getFeaturedWallpapers = async (req, res, next) => {
  try {
    const { limit = 12 } = req.query;

    const wallpapers = await Wallpaper.find({
      featured: true,
      status: 'approved',
      isActive: true
    })
      .populate('categories', 'name slug color')
      .limit(parseInt(limit))
      .sort('-createdAt');

    res.json({
      success: true,
      data: { wallpapers }
    });
  } catch (error) {
    next(error);
  }
};
