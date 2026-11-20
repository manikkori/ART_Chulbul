import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer to Cloudinary or fallback to data URI if Cloudinary is not configured
 */
export const uploadToCloudinary = async (fileBuffer, folder = 'artchulbul', originalName = '') => {
  const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
                        process.env.CLOUDINARY_API_KEY &&
                        process.env.CLOUDINARY_API_SECRET;

  if (!hasCloudinary) {
    // Graceful fallback for local development when Cloudinary keys are not yet configured:
    // Convert to inline data URI so images display directly and work everywhere
    const base64Data = fileBuffer.toString('base64');
    const mimeType = originalName.endsWith('.png') ? 'image/png' :
                     originalName.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64Data}`;
    return {
      url: dataUri,
      publicId: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      originalName
    };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          originalName
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId || publicId.startsWith('local_')) {
    return { result: 'ok' };
  }
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, error.message);
    return null;
  }
};

export default cloudinary;
