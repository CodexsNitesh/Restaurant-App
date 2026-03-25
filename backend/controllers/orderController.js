const Order = require('../models/Order');

const getAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.table) filter.tableNumber = req.query.table;
    if (req.query.search) filter.orderNumber = { $regex: req.query.search, $options: 'i' };
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const getOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.menuItem');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const create = async (req, res) => {
  try {
    const { orderType, tableNumber } = req.body;

    if (!orderType) {
      return res.status(400).json({ message: 'orderType is required' });
    }
    if (orderType === 'dine-in' && !tableNumber) {
      return res.status(400).json({ message: 'tableNumber is required for dine-in orders' });
    }

    if (orderType === 'takeaway') {
      req.body.tableNumber = null; // normalize
    }

    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const updateStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

// Stats for dashboard overview
const getStats = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const pending = await Order.countDocuments({ status: 'Pending' });
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['Served', 'Paid'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    res.json({
      totalOrders: total,
      pendingOrders: pending,
      totalRevenue: revenue[0]?.total || 0,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Daily revenue for chart
const getDailyRevenue = async (req, res) => {
  try {
    const data = await Order.aggregate([
      { $match: { status: { $in: ['Served', 'Paid'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAll, getOne, create, updateStatus, getStats, getDailyRevenue };