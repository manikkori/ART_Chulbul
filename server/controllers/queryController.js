import Query from '../models/Query.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Submit a new query
 * @route   POST /api/queries
 * @access  Public (Optionally authenticated)
 */
export const submitQuery = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return sendError(res, 'Please provide name, email, subject, and your message.', 400);
  }

  const query = await Query.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    user: req.user ? req.user.id : null,
    status: 'pending'
  });

  return sendSuccess(res, 'Your message has been sent to the artist. You will receive replies inside your account.', query, 201);
});

/**
 * @desc    Get current user's submitted queries and replies
 * @route   GET /api/queries/my
 * @access  Private (Customer)
 */
export const getMyQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find({
    $or: [
      { user: req.user.id },
      { email: req.user.email.toLowerCase() }
    ]
  }).sort({ createdAt: -1 });

  return sendSuccess(res, 'Your queries retrieved.', queries);
});

/**
 * @desc    Get all queries (Admin)
 * @route   GET /api/queries
 * @access  Private/Admin
 */
export const getAllQueries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status && status !== 'all') {
    filter.status = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await Query.countDocuments(filter);
  const queries = await Query.find(filter)
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return sendSuccess(res, 'Queries retrieved.', queries, 200, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Reply to a query (Admin)
 * @route   POST /api/queries/:id/reply
 * @access  Private/Admin
 */
export const replyQuery = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim() === '') {
    return sendError(res, 'Reply message cannot be empty.', 400);
  }

  const query = await Query.findById(req.params.id);
  if (!query) {
    return sendError(res, 'Query not found.', 404);
  }

  query.replies.push({
    senderRole: 'admin',
    message: message.trim(),
    sentAt: new Date()
  });

  query.status = 'resolved';
  await query.save();

  return sendSuccess(res, 'Reply posted successfully.', query);
});

/**
 * @desc    Update query status (Admin)
 * @route   PUT /api/queries/:id/status
 * @access  Private/Admin
 */
export const updateQueryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'resolved'].includes(status)) {
    return sendError(res, 'Invalid status.', 400);
  }

  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!query) {
    return sendError(res, 'Query not found.', 404);
  }

  return sendSuccess(res, 'Query status updated.', query);
});
