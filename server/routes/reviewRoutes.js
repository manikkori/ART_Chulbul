import express from 'express';
import {
  getPublicReviews,
  getArtworkReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/public', getPublicReviews);
router.get('/artwork/:artworkId', getArtworkReviews);
router.post('/', protect, uploadSingle, createReview);

// Admin routes
router.get('/', protect, authorize('admin'), getAllReviews);
router.put('/:id', protect, authorize('admin'), updateReviewStatus);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
