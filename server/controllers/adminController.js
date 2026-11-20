import mongoose from 'mongoose';
import CustomOrder from '../models/CustomOrder.js';
import User from '../models/User.js';
import Query from '../models/Query.js';
import Review from '../models/Review.js';
import Artwork from '../models/Artwork.js';
import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get dashboard metrics, charts data, and recent orders
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // 1. Orders by Status counts
  const statusCountsRaw = await CustomOrder.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const ordersByStatus = {};
  statusCountsRaw.forEach((sc) => {
    ordersByStatus[sc._id] = sc.count;
  });

  // 2. New orders this week
  const newOrdersThisWeek = await CustomOrder.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });

  // 3. Quoted value (sum of accepted/in progress/completed/shipped/delivered quotes)
  const quotedValueRaw = await CustomOrder.aggregate([
    {
      $match: {
        status: { $in: ['Accepted', 'In Progress', 'Completed', 'Shipped', 'Delivered'] },
        'quote.amount': { $gt: 0 }
      }
    },
    { $group: { _id: null, total: { $sum: '$quote.amount' } } }
  ]);
  const quotedValue = quotedValueRaw.length > 0 ? quotedValueRaw[0].total : 0;

  // 4. Total Customers
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  // 5. Pending Queries & Reviews
  const pendingQueries = await Query.countDocuments({ status: 'pending' });
  const pendingReviews = await Review.countDocuments({ isApproved: false });
  const totalArtworks = await Artwork.countDocuments();

  // 6. Recent Orders
  const recentOrders = await CustomOrder.find()
    .populate('customer', 'name email avatar')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(8);

  return sendSuccess(res, 'Dashboard statistics retrieved.', {
    ordersByStatus,
    newOrdersThisWeek,
    quotedValue,
    totalCustomers,
    pendingQueries,
    pendingReviews,
    totalArtworks,
    recentOrders
  });
});

/**
 * @desc    Get all orders with search, filters, and pagination (Admin)
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 15 } = req.query;

  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    // Search by orderNumber or customer name/email
    const matchedUsers = await User.find({
      $or: [
        { name: new RegExp(s, 'i') },
        { email: new RegExp(s, 'i') }
      ]
    }).select('_id');

    const userIds = matchedUsers.map((u) => u._id);

    query.$or = [
      { orderNumber: new RegExp(s, 'i') },
      { customer: { $in: userIds } },
      { medium: new RegExp(s, 'i') }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await CustomOrder.countDocuments(query);
  const orders = await CustomOrder.find(query)
    .populate('customer', 'name email phone avatar')
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return sendSuccess(res, 'Orders list retrieved.', orders, 200, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Send or update quote for an order
 * @route   POST /api/admin/orders/:id/quote
 * @access  Private/Admin
 */
export const sendOrderQuote = asyncHandler(async (req, res) => {
  const { amount, estimatedDays, note } = req.body;

  if (!amount || Number(amount) <= 0) {
    return sendError(res, 'Please provide a valid quote amount in INR.', 400);
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  const query = isObjectId ? { _id: req.params.id } : { orderNumber: req.params.id };

  const order = await CustomOrder.findOne(query);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  order.quote = {
    amount: Number(amount),
    estimatedDays: Number(estimatedDays) || 7,
    note: note ? note.trim() : '',
    sentAt: new Date()
  };

  order.status = 'Quoted';
  order.statusHistory.push({
    status: 'Quoted',
    timestamp: new Date(),
    note: `Artist sent quote of ₹${amount} with estimated ${estimatedDays || 7} days completion.${note ? ' Note: ' + note : ''}`,
    changedBy: req.user.id
  });

  await order.save();

  // Notify customer if customer reference exists
  if (order.customer) {
    await Notification.create({
      recipient: order.customer,
      type: 'quote_received',
      title: 'Custom Art Quote Received!',
      message: `The artist sent a quote of ₹${amount} for order ${order.orderNumber}. Tap to review and accept.`,
      link: `/my-orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Quote sent to customer successfully.', order);
});

/**
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = [
    'Pending Review',
    'Quoted',
    'Accepted',
    'In Progress',
    'Completed',
    'Shipped',
    'Delivered',
    'Declined',
    'Rejected',
    'Cancelled'
  ];

  if (!validStatuses.includes(status)) {
    return sendError(res, 'Invalid status.', 400);
  }

  const order = await CustomOrder.findById(req.params.id);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  order.status = status;
  order.statusHistory.push({
    status,
    timestamp: new Date(),
    note: note ? note.trim() : `Status updated to ${status} by artist`,
    changedBy: req.user.id
  });

  if (status === 'Delivered') {
    order.shipping.deliveredAt = new Date();
  }

  await order.save();

  // Notify customer
  if (order.customer) {
    await Notification.create({
      recipient: order.customer,
      type: 'status_changed',
      title: `Order Status: ${status}`,
      message: note || `Your order ${order.orderNumber} is now ${status}.`,
      link: `/my-orders/${order._id}`
    });
  }

  return sendSuccess(res, `Order status updated to '${status}'.`, order);
});

/**
 * @desc    Reject custom order with reason
 * @route   POST /api/admin/orders/:id/reject
 * @access  Private/Admin
 */
export const rejectOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  if (!reason || reason.trim() === '') {
    return sendError(res, 'Please provide a reason for rejecting the order.', 400);
  }

  const order = await CustomOrder.findById(req.params.id);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  order.status = 'Rejected';
  order.rejectionReason = reason.trim();
  order.statusHistory.push({
    status: 'Rejected',
    timestamp: new Date(),
    note: `Rejected: ${reason.trim()}`,
    changedBy: req.user.id
  });

  await order.save();

  // Notify customer
  if (order.customer) {
    await Notification.create({
      recipient: order.customer,
      type: 'status_changed',
      title: 'Order Status Update',
      message: `Order ${order.orderNumber} could not be accepted. Reason: ${reason.trim()}`,
      link: `/my-orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Order marked as rejected.', order);
});

/**
 * @desc    Upload progress photo for an order
 * @route   POST /api/admin/orders/:id/progress
 * @access  Private/Admin
 */
export const uploadOrderProgress = asyncHandler(async (req, res) => {
  const { caption } = req.body;

  const order = await CustomOrder.findById(req.params.id);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  if (!req.file && !req.body.imageUrl) {
    return sendError(res, 'Please select a progress photo to upload.', 400);
  }

  let imageData = { url: '', publicId: '' };
  if (req.file) {
    const up = await uploadToCloudinary(req.file.buffer, 'artchulbul/orders/progress', req.file.originalname);
    imageData = { url: up.url, publicId: up.publicId };
  } else if (req.body.imageUrl) {
    imageData = { url: req.body.imageUrl, publicId: '' };
  }

  order.progressUpdates.push({
    image: imageData,
    caption: caption ? caption.trim() : 'Work in progress snap',
    date: new Date()
  });

  await order.save();

  // Notify customer
  if (order.customer) {
    await Notification.create({
      recipient: order.customer,
      type: 'progress_updated',
      title: 'New Progress Photo Shared!',
      message: `The artist shared a work-in-progress snap for order ${order.orderNumber}.`,
      link: `/my-orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Progress update uploaded successfully.', order);
});

/**
 * @desc    Update shipping & dispatch info
 * @route   PUT /api/admin/orders/:id/shipping
 * @access  Private/Admin
 */
export const updateOrderShipping = asyncHandler(async (req, res) => {
  const { courier, trackingNumber, trackingUrl } = req.body;

  if (!trackingNumber) {
    return sendError(res, 'Please provide tracking number.', 400);
  }

  const order = await CustomOrder.findById(req.params.id);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  order.shipping = {
    courier: courier || 'Domestic Courier',
    trackingNumber: trackingNumber.trim(),
    trackingUrl: trackingUrl ? trackingUrl.trim() : '',
    shippedAt: new Date()
  };

  order.status = 'Shipped';
  order.statusHistory.push({
    status: 'Shipped',
    timestamp: new Date(),
    note: `Dispatched via ${courier || 'Courier'}. Tracking No: ${trackingNumber.trim()}`,
    changedBy: req.user.id
  });

  await order.save();

  // Notify customer
  if (order.customer) {
    await Notification.create({
      recipient: order.customer,
      type: 'status_changed',
      title: 'Your Artwork Has Shipped!',
      message: `Order ${order.orderNumber} is on its way via ${courier || 'Courier'}. Tracking: ${trackingNumber}`,
      link: `/my-orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Shipping updated and order marked Shipped.', order);
});

/**
 * @desc    Update internal admin notes
 * @route   PUT /api/admin/orders/:id/notes
 * @access  Private/Admin
 */
export const updateAdminNotes = asyncHandler(async (req, res) => {
  const { adminNotes } = req.body;

  const order = await CustomOrder.findByIdAndUpdate(
    req.params.id,
    { adminNotes: adminNotes || '' },
    { new: true }
  );

  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  return sendSuccess(res, 'Internal admin notes saved.', order);
});

/**
 * @desc    Get all registered customers
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
export const getAllCustomers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 20 } = req.query;

  const query = { role: 'customer' };

  if (search && search.trim() !== '') {
    const s = new RegExp(search.trim(), 'i');
    query.$or = [{ name: s }, { email: s }];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(query);
  const customers = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  // Attach order counts for each customer
  const customersWithCounts = await Promise.all(
    customers.map(async (cust) => {
      const orderCount = await CustomOrder.countDocuments({ customer: cust._id });
      return {
        ...cust.toObject(),
        orderCount
      };
    })
  );

  return sendSuccess(res, 'Customers list retrieved.', customersWithCounts, 200, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Toggle customer blocked status
 * @route   PATCH /api/admin/customers/:id/toggle-block
 * @access  Private/Admin
 */
export const toggleCustomerBlock = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id);

  if (!customer || customer.role === 'admin') {
    return sendError(res, 'Customer not found or cannot block admin.', 404);
  }

  customer.isBlocked = !customer.isBlocked;
  await customer.save();

  return sendSuccess(
    res,
    customer.isBlocked ? 'Customer account deactivated.' : 'Customer account reactivated.',
    customer
  );
});

/**
 * @desc    Get a specific customer's order history (Admin)
 * @route   GET /api/admin/customers/:id/orders
 * @access  Private/Admin
 */
export const getCustomerOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await CustomOrder.find({ customer: req.params.id })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 'Customer orders retrieved.', orders);
});
