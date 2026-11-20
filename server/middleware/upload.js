import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPG, PNG, and WebP images are allowed.'), false);
  }
};

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
}).single('image');

export const uploadMultiple = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter
}).array('images', 5); // Up to 5 images

export const uploadAttachments = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
}).array('attachments', 3);
