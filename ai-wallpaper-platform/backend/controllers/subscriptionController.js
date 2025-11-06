const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const emailService = require('../utils/email');

// Subscription plans configuration
const PLANS = {
  basic: {
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      'Unlimited downloads',
      'High-resolution images',
      'Personal use license',
      'Email support'
    ]
  },
  pro: {
    name: 'Pro',
    price: 19.99,
    interval: 'month',
    features: [
      'Everything in Basic',
      'Commercial use license',
      'Priority support',
      'Early access to new wallpapers',
      'Custom formats'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'API access',
      'Dedicated account manager',
      'Custom AI generation requests',
      'White-label options'
    ]
  }
};

/**
 * @desc    Get available subscription plans
 * @route   GET /api/subscriptions/plans
 * @access  Public
 */
exports.getPlans = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { plans: PLANS }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create checkout session
 * @route   POST /api/subscriptions/create-checkout
 * @access  Private
 */
exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    const user = req.user;

    // Create or get Stripe customer
    let customerId = user.subscription.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;

      user.subscription.stripeCustomerId = customerId;
      await user.save();
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${PLANS[plan].name} Plan`,
              description: PLANS[plan].features.join(', ')
            },
            unit_amount: Math.round(PLANS[plan].price * 100),
            recurring: {
              interval: PLANS[plan].interval
            }
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      metadata: {
        userId: user._id.toString(),
        plan
      }
    });

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Webhook handler for Stripe events
 * @route   POST /api/subscriptions/webhook
 * @access  Public (Stripe)
 */
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

/**
 * @desc    Get current subscription status
 * @route   GET /api/subscriptions/status
 * @access  Private
 */
exports.getSubscriptionStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let stripeSubscription = null;
    if (user.subscription.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(
          user.subscription.stripeSubscriptionId
        );
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
      }
    }

    res.json({
      success: true,
      data: {
        subscription: user.subscription,
        stripeSubscription,
        hasActiveSubscription: user.hasActiveSubscription()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel subscription
 * @route   POST /api/subscriptions/cancel
 * @access  Private
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found'
      });
    }

    // Cancel at period end
    const subscription = await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: true }
    );

    user.subscription.cancelAtPeriodEnd = true;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
      data: {
        cancelAt: new Date(subscription.cancel_at * 1000)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resume cancelled subscription
 * @route   POST /api/subscriptions/resume
 * @access  Private
 */
exports.resumeSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user.subscription.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No subscription found'
      });
    }

    await stripe.subscriptions.update(
      user.subscription.stripeSubscriptionId,
      { cancel_at_period_end: false }
    );

    user.subscription.cancelAtPeriodEnd = false;
    await user.save();

    res.json({
      success: true,
      message: 'Subscription resumed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions for webhook handlers
async function handleCheckoutCompleted(session) {
  const userId = session.metadata.userId;
  const plan = session.metadata.plan;

  const user = await User.findById(userId);
  if (!user) return;

  user.subscription.plan = plan;
  user.subscription.status = 'active';
  user.subscription.stripeSubscriptionId = session.subscription;
  await user.save();

  await emailService.sendSubscriptionConfirmation(user, plan);
}

async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  });

  if (!user) return;

  user.subscription.status = subscription.status;
  user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
  user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
  user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;

  await user.save();
}

async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({
    'subscription.stripeSubscriptionId': subscription.id
  });

  if (!user) return;

  user.subscription.status = 'canceled';
  user.subscription.plan = 'free';
  await user.save();
}

async function handlePaymentSucceeded(invoice) {
  const user = await User.findOne({
    'subscription.stripeCustomerId': invoice.customer
  });

  if (!user) return;

  user.subscription.status = 'active';
  await user.save();
}

async function handlePaymentFailed(invoice) {
  const user = await User.findOne({
    'subscription.stripeCustomerId': invoice.customer
  });

  if (!user) return;

  user.subscription.status = 'past_due';
  await user.save();
}

module.exports.PLANS = PLANS;
