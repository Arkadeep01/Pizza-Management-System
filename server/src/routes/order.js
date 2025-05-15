const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['received', 'in_kitchen', 'out_for_delivery', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Send notification to user about status update
    await sendOrderStatusUpdate(order.user.email, order._id, status);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Get order details (admin only)
router.get('/:orderId', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details' });
  }
});

// Get orders by date range (admin only)
router.get('/admin/date-range', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by date range' });
  }
});

// Get orders by status (admin only)
router.get('/admin/status/:status', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find({ status: req.params.status })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders by status' });
  }
});

// Cancel order (admin only)
router.put('/:orderId/cancel', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore inventory
    await restoreInventory(order);

    // Send cancellation notification
    await sendOrderCancellationNotification(order.user.email, order._id);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling order' });
  }
});

// Get order statistics (admin only)
router.get('/admin/statistics', adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const inKitchenOrders = await Order.countDocuments({ status: 'in_kitchen' });
    const outForDeliveryOrders = await Order.countDocuments({ status: 'out_for_delivery' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      inKitchenOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
});

module.exports = router; 