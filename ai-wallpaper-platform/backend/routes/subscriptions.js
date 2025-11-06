const express = require('express');
const router = express.Router();
const {
  getPlans,
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
  resumeSubscription
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/plans', getPlans);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.get('/status', protect, getSubscriptionStatus);
router.post('/create-checkout', protect, createCheckoutSession);
router.post('/cancel', protect, cancelSubscription);
router.post('/resume', protect, resumeSubscription);

module.exports = router;
