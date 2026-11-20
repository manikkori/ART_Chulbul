import Notification from '../models/Notification.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get user's notifications and unread count
 * @route   GET /api/notifications
 * @access  Private
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  return sendSuccess(res, 'Notifications retrieved.', {
    notifications,
    unreadCount
  });
});

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return sendError(res, 'Notification not found.', 404);
  }

  return sendSuccess(res, 'Notification marked as read.', notification);
});

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  return sendSuccess(res, 'All notifications marked as read.');
});
