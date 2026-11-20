import Review from '../models/Review.js';
import CustomOrder from '../models/CustomOrder.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

/**
 * @desc    Get approved reviews for homepage & public display
 * @route   GET /api/reviews/public
 * @access  Public
 */
export const getPublicReviews = asyncHandler(async (req, res) => {
  const { homeOnly = 'false' } = req.query;

  const filter = { isApproved: true };
  if (homeOnly === 'true') {
    filter.showOnHome = true;
  }

  const reviews = await Review.find(filter)
    .populate('customer', 'name avatar')
    .populate('artwork', 'title slug coverImage')
    .sort({ createdAt: -1 })
    .limit(10);

  return sendSuccess(res, 'Approved reviews retrieved.', reviews);
});

/**
 * @desc    Get approved reviews for a specific artwork
 * @route   GET /api/reviews/artwork/:artworkId
 * @access  Public
 */
export const getArtworkReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    artwork: req.params.artworkId,
    isApproved: true
  })
    .populate('customer', 'name avatar')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 'Artwork reviews retrieved.', reviews);
});

/**
 * @desc    Create a review (Customer after delivery)
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, orderId, artworkId } = req.body;

  if (!rating || !comment) {
    return sendError(res, 'Please provide rating (1-5) and comment.', 400);
  }

  if (Number(rating) < 1 || Number(rating) > 5) {
    return sendError(res, 'Rating must be between 1 and 5.', 400);
  }

  // If tied to custom order, verify the order belongs to this customer and is Delivered
  if (orderId) {
    const order = await CustomOrder.findOne({
      _id: orderId,
      customer: req.user.id
    });
    if (!order) {
      return sendError(res, 'Order not found or not authorized.', 404);
    }
    if (order.status !== 'Delivered') {
      return sendError(res, 'You can only submit a review after your artwork has been delivered.', 400);
    }
  }

  let photoData = { url: '', publicId: '' };
  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, 'artchulbul/reviews', req.file.originalname);
    photoData = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const review = await Review.create({
    customer: req.user.id,
    order: orderId || null,
    artwork: artworkId || null,
    rating: Number(rating),
    comment: comment.trim(),
    photo: photoData,
    isApproved: false, // Requires admin moderation
    showOnHome: false
  });

  return sendSuccess(res, 'Thank you! Your review has been submitted for moderation.', review, 201);
});

/**
 * @desc    Get all reviews (Admin)
 * @route   GET /api/reviews
 * @access  Private/Admin
 */
export const getAllReviews = asyncHandler(async (req, res) => {
  const { status = 'all', page = 1, limit = 20 } = req.query;

  const filter = {};
  if (status === 'approved') filter.isApproved = true;
  if (status === 'pending') filter.isApproved = false;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate('customer', 'name email avatar')
    .populate('artwork', 'title slug coverImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return sendSuccess(res, 'Reviews retrieved.', reviews, 200, {
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum)
  });
});

/**
 * @desc    Update review status / approve / toggle show on home (Admin)
 * @route   PUT /api/reviews/:id
 * @access  Private/Admin
 */
export const updateReviewStatus = asyncHandler(async (req, res) => {
  const { isApproved, showOnHome } = req.body;

  const review = await Review.findById(req.params.id);
  if (!review) {
    return sendError(res, 'Review not found.', 404);
  }

  if (isApproved !== undefined) review.isApproved = isApproved;
  if (showOnHome !== undefined) review.showOnHome = showOnHome;

  await review.save();
  return sendSuccess(res, 'Review status updated.', review);
});

/**
 * @desc    Delete a review (Admin)
 * @route   DELETE /api/reviews/:id
 * @access  Private/Admin
 */
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return sendError(res, 'Review not found.', 404);
  }

  if (review.photo && review.photo.publicId) {
    await deleteFromCloudinary(review.photo.publicId);
  }

  await review.deleteOne();
  return sendSuccess(res, 'Review deleted.');
});
