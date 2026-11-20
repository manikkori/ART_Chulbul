import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin protected routes
router.post('/', protect, authorize('admin'), uploadSingle, createCategory);
router.put('/:id', protect, authorize('admin'), uploadSingle, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
