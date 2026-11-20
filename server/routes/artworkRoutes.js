import express from 'express';
import {
  getArtworks,
  getFeaturedArtworks,
  getArtworkBySlug,
  createArtwork,
  updateArtwork,
  deleteArtwork
} from '../controllers/artworkController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getArtworks);
router.get('/featured', getFeaturedArtworks);
router.get('/:slug', getArtworkBySlug);

// Admin protected routes
router.post('/', protect, authorize('admin'), uploadMultiple, createArtwork);
router.put('/:id', protect, authorize('admin'), uploadMultiple, updateArtwork);
router.delete('/:id', protect, authorize('admin'), deleteArtwork);

export default router;
