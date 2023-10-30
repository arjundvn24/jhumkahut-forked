import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discount,
    couponDiscount,
    taxPrice,
    shippingPrice,
    convenienceFee,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      discount,
      couponDiscount,
      taxPrice,
      shippingPrice,
      convenienceFee,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentId = req.body.razorpay_payment_id;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderToReturned = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isReturned = true;
    order.ReturnedAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.ADMIN_PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({ });
  const orders = await Order.find({}).populate('user', 'id name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
    res.json({ orders, page, pages: Math.ceil(count / pageSize) });
  
});

// @desc    Get monthlyy revenue
// @route   GET /api/orders/revenue
// @access  Private/Admin
const getRevenue = asyncHandler(async (req, res) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // Adding 1 to get the current month (January is 0)

  // Define an object to store revenue month-wise
  const revenueByMonth = {};

  for (let i = 0; i < 6; i++) {
    const month = currentMonth - i;
    const year = currentYear;

    // Adjust month and year if the current month is less than the past 6 months
    if (month <= 0) {
      month += 12;
      year -= 1;
    }

    // Calculate the start and end dates of the month
    const startDate = new Date(year, month - 1, 1); // month - 1 because JavaScript months are zero-based
    const endDate = new Date(year, month, 0); // 0 will give the last day of the previous month

    // Find orders within the specified month and populate the 'user' field with 'id' and 'name'
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('user', 'id name');

    let revenue = 0;

    // Calculate the revenue for each order
    orders.forEach(order => {
      // Check if order returned
      if (!order.isReturned) { 
      const { itemsPrice, discount, couponDiscount } = order;
      const totalRevenue = itemsPrice - discount - couponDiscount;
      revenue += totalRevenue;
      }
    });

    // Get the month name
    const monthName = startDate.toLocaleString('default', { month: 'short', year: 'numeric' });

    // Store the revenue in the object with the month name as the key
    revenueByMonth[monthName] = revenue.toFixed(2);
  }

  res.json({ revenueByMonth });
});


export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderToReturned,
  getRevenue,
  getOrders,
};
