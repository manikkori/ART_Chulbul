import express from 'express';
import { getOrderMessages, sendOrderMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { uploadAttachments } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.get('/:orderId', getOrderMessages);
router.post('/:orderId', uploadAttachments, sendOrderMessage);

export default router;
