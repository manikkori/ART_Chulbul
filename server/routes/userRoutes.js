import express from 'express';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  toggleWishlist
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All user profile management routes require login

// Delivery Addresses
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist/:artworkId', toggleWishlist);

export default router;
