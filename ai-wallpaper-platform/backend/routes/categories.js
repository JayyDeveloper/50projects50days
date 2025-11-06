const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort('order')
      .select('-__v');

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/categories/:slug
 * @access  Public
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
