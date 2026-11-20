import express from 'express';
import {
  getDashboardStats,
  getAllOrdersAdmin,
  sendOrderQuote,
  updateOrderStatus,
  rejectOrder,
  uploadOrderProgress,
  updateOrderShipping,
  updateAdminNotes,
  getAllCustomers,
  toggleCustomerBlock,
  getCustomerOrdersAdmin
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Protect and authorize all routes under /api/admin
router.use(protect, authorize('admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Orders management
router.get('/orders', getAllOrdersAdmin);
router.post('/orders/:id/quote', sendOrderQuote);
router.put('/orders/:id/status', updateOrderStatus);
router.post('/orders/:id/reject', rejectOrder);
router.post('/orders/:id/progress', uploadSingle, uploadOrderProgress);
router.put('/orders/:id/shipping', updateOrderShipping);
router.put('/orders/:id/notes', updateAdminNotes);

// Customers management
router.get('/customers', getAllCustomers);
router.patch('/customers/:id/toggle-block', toggleCustomerBlock);
router.get('/customers/:id/orders', getCustomerOrdersAdmin);

export default router;
