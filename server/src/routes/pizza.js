const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Razorpay = require('razorpay');
const { auth } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Get available pizza bases
router.get('/bases', async (req, res) => {
  try {
    const bases = await PizzaBase.find({ available: true });
    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pizza bases' });
  }
});

// Get available sauces
router.get('/sauces', async (req, res) => {
  try {
    const sauces = await Sauce.find({ available: true });
    res.json(sauces);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sauces' });
  }
});

// Get available cheeses
router.get('/cheeses', async (req, res) => {
  try {
    const cheeses = await Cheese.find({ available: true });
    res.json(cheeses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cheeses' });
  }
});

// Get available toppings
router.get('/toppings', async (req, res) => {
  try {
    const toppings = await Topping.find({ available: true });
    res.json(toppings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching toppings' });
  }
});

// Create order
router.post('/order', auth, [
  body('base').notEmpty(),
  body('sauce').notEmpty(),
  body('cheese').notEmpty(),
  body('toppings').isArray(),
  body('totalAmount').isNumeric()
], async (req, res) => {
  try {
    const { base, sauce, cheese, toppings, totalAmount } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    // Create order in database
    const order = new Order({
      user: req.user.userId,
      base,
      sauce,
      cheese,
      toppings,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending'
    });

    await order.save();

    res.json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Verify payment and confirm order
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    // Verify payment signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update order status
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'confirmed';
    order.paymentId = razorpayPaymentId;
    await order.save();

    // Update inventory
    await updateInventory(order);

    res.json({ message: 'Payment verified and order confirmed' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// Get user orders
router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get order status
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order status' });
  }
});

module.exports = router; 