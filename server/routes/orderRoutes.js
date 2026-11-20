import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  acceptQuote,
  declineQuote
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All order routes require authentication

router.post('/', uploadMultiple, createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/accept-quote', acceptQuote);
router.post('/:id/decline-quote', declineQuote);

export default router;
