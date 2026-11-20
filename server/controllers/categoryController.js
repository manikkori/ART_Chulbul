import Category from '../models/Category.js';
import Artwork from '../models/Artwork.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// Helper to slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * @desc    Get all active categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = asyncHandler(async (req, res) => {
  const includeInactive = req.query.all === 'true' && req.user && req.user.role === 'admin';
  const query = includeInactive ? {} : { isActive: true };

  const categories = await Category.find(query).sort({ displayOrder: 1, createdAt: 1 });

  // Count artworks per category
  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Artwork.countDocuments({ category: cat._id, isPublished: true });
      return {
        ...cat.toObject(),
        artworkCount: count
      };
    })
  );

  return sendSuccess(res, 'Categories retrieved.', categoriesWithCount);
});

/**
 * @desc    Get single category by slug with its artworks
 * @route   GET /api/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return sendError(res, 'Category not found.', 404);
  }

  const artworks = await Artwork.find({
    category: category._id,
    isPublished: true
  }).sort({ createdAt: -1 });

  return sendSuccess(res, 'Category details retrieved.', {
    category,
    artworks
  });
});

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, startingPrice, displayOrder, isActive } = req.body;

  if (!name) {
    return sendError(res, 'Category name is required.', 400);
  }

  const slug = slugify(name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    return sendError(res, 'A category with this name already exists.', 400);
  }

  let imageData = { url: '', publicId: '' };
  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, 'artchulbul/categories', req.file.originalname);
    imageData = { url: uploaded.url, publicId: uploaded.publicId };
  } else if (req.body.imageUrl) {
    imageData = { url: req.body.imageUrl, publicId: '' };
  }

  const category = await Category.create({
    name,
    slug,
    description: description || '',
    startingPrice: Number(startingPrice) || 0,
    displayOrder: Number(displayOrder) || 0,
    isActive: isActive !== undefined ? isActive : true,
    image: imageData
  });

  return sendSuccess(res, 'Category created successfully.', category, 201);
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 'Category not found.', 404);
  }

  const { name, description, startingPrice, displayOrder, isActive } = req.body;

  if (name && name !== category.name) {
    category.name = name;
    category.slug = slugify(name);
  }

  if (description !== undefined) category.description = description;
  if (startingPrice !== undefined) category.startingPrice = Number(startingPrice);
  if (displayOrder !== undefined) category.displayOrder = Number(displayOrder);
  if (isActive !== undefined) category.isActive = isActive;

  if (req.file) {
    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }
    const uploaded = await uploadToCloudinary(req.file.buffer, 'artchulbul/categories', req.file.originalname);
    category.image = { url: uploaded.url, publicId: uploaded.publicId };
  } else if (req.body.imageUrl) {
    category.image = { url: req.body.imageUrl, publicId: '' };
  }

  await category.save();

  return sendSuccess(res, 'Category updated successfully.', category);
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return sendError(res, 'Category not found.', 404);
  }

  // Check if any artworks exist under this category
  const linkedArtworks = await Artwork.countDocuments({ category: category._id });
  if (linkedArtworks > 0) {
    return sendError(res, `Cannot delete category. There are ${linkedArtworks} artwork(s) associated with it.`, 400);
  }

  if (category.image && category.image.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  await category.deleteOne();

  return sendSuccess(res, 'Category deleted successfully.');
});
