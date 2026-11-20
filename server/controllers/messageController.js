import mongoose from 'mongoose';
import Message from '../models/Message.js';
import CustomOrder from '../models/CustomOrder.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get all messages for an order
 * @route   GET /api/messages/:orderId
 * @access  Private (Customer or Admin)
 */
export const getOrderMessages = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
  const query = isObjectId ? { _id: orderId } : { orderNumber: orderId };

  const order = await CustomOrder.findOne(query);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  // Ensure caller is either the order's customer or an admin
  const orderCustId = order.customer?._id
    ? order.customer._id.toString()
    : order.customer?.toString();

  if (req.user.role !== 'admin' && orderCustId !== req.user.id) {
    return sendError(res, 'Not authorized to view messages for this order.', 403);
  }

  const messages = await Message.find({ order: order._id })
    .populate('sender', 'name role avatar')
    .sort({ createdAt: 1 });

  // Mark unread messages as read by current user asynchronously
  Message.updateMany(
    { order: order._id, readBy: { $ne: req.user.id } },
    { $addToSet: { readBy: req.user.id } }
  ).exec();

  return sendSuccess(res, 'Messages retrieved.', messages);
});

/**
 * @desc    Send a message in order chat
 * @route   POST /api/messages/:orderId
 * @access  Private (Customer or Admin)
 */
export const sendOrderMessage = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { text } = req.body;

  const isObjectId = mongoose.Types.ObjectId.isValid(orderId);
  const query = isObjectId ? { _id: orderId } : { orderNumber: orderId };

  const order = await CustomOrder.findOne(query);
  if (!order) {
    return sendError(res, 'Order not found.', 404);
  }

  const orderCustId = order.customer?._id
    ? order.customer._id.toString()
    : order.customer?.toString();

  if (req.user.role !== 'admin' && orderCustId !== req.user.id) {
    return sendError(res, 'Not authorized to message in this order.', 403);
  }

  // Handle uploaded attachments if any
  const attachments = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const up = await uploadToCloudinary(file.buffer, 'artchulbul/chat', file.originalname);
      attachments.push({
        url: up.url,
        publicId: up.publicId,
        name: file.originalname,
        mimeType: file.mimetype
      });
    }
  }

  if ((!text || text.trim() === '') && attachments.length === 0) {
    return sendError(res, 'Message text or attachment is required.', 400);
  }

  const message = await Message.create({
    order: order._id,
    sender: req.user.id,
    text: text ? text.trim() : '',
    attachments,
    readBy: [req.user.id]
  });

  // Determine recipient for notification
  const isSenderAdmin = req.user.role === 'admin';

  if (isSenderAdmin) {
    // Admin replied -> Notify customer
    if (order.customer) {
      await Notification.create({
        recipient: order.customer,
        type: 'new_message',
        title: 'New Message from Artist',
        message: text ? text.slice(0, 100) : 'Sent an attachment',
        link: `/my-orders/${order._id}`
      });
    }
  } else {
    // Customer sent message -> Notify all admins
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        type: 'new_message',
        title: `New Message on ${order.orderNumber}`,
        message: `${req.user.name}: ${text ? text.slice(0, 80) : 'Sent attachment'}`,
        link: `/admin/orders/${order._id}`
      });
    }
  }

  const populated = await Message.findById(message._id).populate('sender', 'name role avatar');

  return sendSuccess(res, 'Message sent.', populated, 201);
});
