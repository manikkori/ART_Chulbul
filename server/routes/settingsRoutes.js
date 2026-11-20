import express from 'express';
import multer from 'multer';
import {
  getSettings,
  updateSettings,
  getArtistProfile,
  updateArtistProfile
} from '../controllers/settingsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const settingsUploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 }
]);

const artistUploadFields = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'avatarIllustration', maxCount: 1 }
]);

// Public routes
router.get('/', getSettings);
router.get('/artist-profile', getArtistProfile);

// Admin routes
router.put('/', protect, authorize('admin'), settingsUploadFields, updateSettings);
router.put('/artist-profile', protect, authorize('admin'), artistUploadFields, updateArtistProfile);

export default router;
