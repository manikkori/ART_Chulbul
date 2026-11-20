import mongoose from 'mongoose';
import CustomOrder from '../models/CustomOrder.js';
import Category from '../models/Category.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { generateOrderNumber } from '../utils/orderNumber.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Valid status transitions map
const VALID_TRANSITIONS = {
  'Pending Review': ['Quoted', 'Rejected', 'Cancelled'],
  'Quoted': ['Accepted', 'Declined', 'Cancelled', 'Quoted'],
  'Accepted': ['In Progress', 'Cancelled'],
  'In Progress': ['Completed', 'Cancelled'],
  'Completed': ['Shipped'],
  'Shipped': ['Delivered'],
  'Delivered': [],
  'Declined': ['Quoted'], // Artist can re-quote after discussion
  'Rejected': [],
  'Cancelled': []
};

/**
 * @desc    Create a new custom order
 * @route   POST /api/orders
 * @access  Private (Customer)
 */
export const createOrder = asyncHandler(async (req, res) => {
  const {
    categoryId,
    medium,
    size,
    description,
    subjectsCount,
    background,
    colors,
    specialInstructions,
    deadline,
    addressSnapshot
  } = req.body;

  if (!categoryId || !medium || !size || !description) {
    return sendError(res, 'Please provide category, medium, size, and artwork description.', 400);
  }

  // Parse delivery address snapshot
  let parsedAddress = null;
  try {
    parsedAddress = typeof addressSnapshot === 'string'
      ? JSON.parse(addressSnapshot)
      : addressSnapshot;
  } catch (err) {
    return sendError(res, 'Invalid address format.', 400);
  }

  if (!parsedAddress || !parsedAddress.recipientName || !parsedAddress.street || !parsedAddress.city) {
    return sendError(res, 'A complete delivery address snapshot is required.', 400);
  }

  // Upload reference photos (up to 5)
  const referenceImages = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer, 'artchulbul/orders/references', file.originalname);
      referenceImages.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        originalName: file.originalname
      });
    }
  } else if (req.body.referenceImageUrls) {
    const urls = Array.isArray(req.body.referenceImageUrls)
      ? req.body.referenceImageUrls
      : [req.body.referenceImageUrls];
    urls.forEach((url) => {
      referenceImages.push({ url, publicId: '', originalName: 'reference.jpg' });
    });
  }

  if (referenceImages.length === 0) {
    return sendError(res, 'Please upload at least one reference photo for the artist.', 400);
  }

  // Generate unique order number (e.g. ART-2026-0001)
  const orderNumber = await generateOrderNumber();

  const newOrder = await CustomOrder.create({
    orderNumber,
    customer: req.user.id,
    category: categoryId,
    medium,
    size,
    referenceImages,
    description: description.trim(),
    preferences: {
      subjectsCount: Number(subjectsCount) || 1,
      background: background ? background.trim() : 'Artist choice / natural',
      colors: colors ? colors.trim() : '',
      specialInstructions: specialInstructions ? specialInstructions.trim() : ''
    },
    deadline: deadline ? new Date(deadline) : null,
    addressSnapshot: parsedAddress,
    status: 'Pending Review',
    statusHistory: [
      {
        status: 'Pending Review',
        timestamp: new Date(),
        note: 'Order submitted by customer with reference photo(s).',
        changedBy: req.user.id
      }
    ],
    paymentStatus: 'pending'
  });

  // Notify all Admins about new order
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      type: 'general',
      title: 'New Custom Order Received',
      message: `${req.user.name} submitted order ${orderNumber} for ${medium}.`,
      link: `/admin/orders/${newOrder._id}`
    });
  }

  const populated = await CustomOrder.findById(newOrder._id)
    .populate('customer', 'name email avatar phone')
    .populate('category', 'name slug');

  return sendSuccess(res, 'Custom order placed successfully! The artist will review your reference and send a quote.', populated, 201);
});

/**
 * @desc    Get current customer's orders
 * @route   GET /api/orders/my
 * @access  Private (Customer)
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const query = { customer: req.user.id };
  if (status && status !== 'all') {
    query.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await CustomOrder.countDocuments(query);
  const orders = await CustomOrder.find(query)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return sendSuccess(res, 'Your orders retrieved.', orders, 200, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Get order details by ID or orderNumber
 * @route   GET /api/orders/:id
 * @access  Private (Customer or Admin)
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
  const query = isObjectId ? { _id: req.params.id } : { orderNumber: req.params.id };

  const order = await CustomOrder.findOne(query)
    .populate('customer', 'name email avatar phone')
    .populate('category', 'name slug')
    .populate('statusHistory.changedBy', 'name role');

  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  // Ensure customer can only view their own order
  const orderCustId = order.customer?._id
    ? order.customer._id.toString()
    : order.customer?.toString();

  if (req.user.role !== 'admin' && orderCustId !== req.user.id) {
    return sendError(res, 'Not authorized to view this order.', 403);
  }

  return sendSuccess(res, 'Order details retrieved.', order);
});

/**
 * @desc    Customer cancels an order
 * @route   POST /api/orders/:id/cancel
 * @access  Private (Customer)
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await CustomOrder.findById(req.params.id);

  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  if (order.customer.toString() !== req.user.id) {
    return sendError(res, 'Not authorized to cancel this order.', 403);
  }

  // Section 4: "Customer can cancel the order only before status 'In Progress'."
  const nonCancellable = ['In Progress', 'Completed', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'];
  if (nonCancellable.includes(order.status)) {
    return sendError(res, `Cannot cancel order in '${order.status}' status. Work has already begun or been completed.`, 400);
  }

  order.status = 'Cancelled';
  order.statusHistory.push({
    status: 'Cancelled',
    timestamp: new Date(),
    note: req.body.reason ? `Customer cancelled: ${req.body.reason}` : 'Cancelled by customer',
    changedBy: req.user.id
  });

  await order.save();

  // Notify admin
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      type: 'status_changed',
      title: 'Order Cancelled',
      message: `Customer cancelled order ${order.orderNumber}.`,
      link: `/admin/orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Order cancelled successfully.', order);
});

/**
 * @desc    Customer accepts quote
 * @route   POST /api/orders/:id/accept-quote
 * @access  Private (Customer)
 */
export const acceptQuote = asyncHandler(async (req, res) => {
  const order = await CustomOrder.findById(req.params.id);

  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  if (order.customer.toString() !== req.user.id) {
    return sendError(res, 'Not authorized.', 403);
  }

  if (order.status !== 'Quoted') {
    return sendError(res, `Cannot accept quote when order is in '${order.status}' status.`, 400);
  }

  order.status = 'Accepted';
  order.quote.acceptedAt = new Date();
  order.statusHistory.push({
    status: 'Accepted',
    timestamp: new Date(),
    note: 'Customer accepted the price quote and estimated timeline.',
    changedBy: req.user.id
  });

  await order.save();

  // Notify admin
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      type: 'quote_accepted',
      title: 'Quote Accepted!',
      message: `Customer accepted quote for order ${order.orderNumber}. You can now start painting.`,
      link: `/admin/orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Quote accepted! The artist will now schedule and begin creating your artwork.', order);
});

/**
 * @desc    Customer declines quote
 * @route   POST /api/orders/:id/decline-quote
 * @access  Private (Customer)
 */
export const declineQuote = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const order = await CustomOrder.findById(req.params.id);

  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  if (order.customer.toString() !== req.user.id) {
    return sendError(res, 'Not authorized.', 403);
  }

  if (order.status !== 'Quoted') {
    return sendError(res, `Cannot decline quote when order is in '${order.status}' status.`, 400);
  }

  order.status = 'Declined';
  order.quote.declinedAt = new Date();
  order.quote.declinedReason = reason || 'Customer declined quote';
  order.statusHistory.push({
    status: 'Declined',
    timestamp: new Date(),
    note: reason ? `Quote declined: ${reason}` : 'Quote declined by customer',
    changedBy: req.user.id
  });

  await order.save();

  // Notify admin
  const admins = await User.find({ role: 'admin' });
  for (const admin of admins) {
    await Notification.create({
      recipient: admin._id,
      type: 'quote_declined',
      title: 'Quote Declined',
      message: `Customer declined quote for order ${order.orderNumber}. Check chat for details.`,
      link: `/admin/orders/${order._id}`
    });
  }

  return sendSuccess(res, 'Quote declined. You can reply in the order chat thread to discuss alternatives.', order);
});
