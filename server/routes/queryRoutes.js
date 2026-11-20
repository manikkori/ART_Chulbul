import express from 'express';
import {
  submitQuery,
  getMyQueries,
  getAllQueries,
  replyQuery,
  updateQueryStatus
} from '../controllers/queryController.js';
import { protect, authorize, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalProtect, submitQuery);
router.get('/my', protect, getMyQueries);

// Admin routes
router.get('/', protect, authorize('admin'), getAllQueries);
router.post('/:id/reply', protect, authorize('admin'), replyQuery);
router.put('/:id/status', protect, authorize('admin'), updateQueryStatus);

export default router;
