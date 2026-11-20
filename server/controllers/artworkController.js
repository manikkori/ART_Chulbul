import Artwork from '../models/Artwork.js';
import Category from '../models/Category.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

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
 * @desc    Get all published artworks (with search, filters, sort, pagination)
 * @route   GET /api/artworks
 * @access  Public
 */
export const getArtworks = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    medium,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 9,
    all = 'false'
  } = req.query;

  // Filter criteria
  const query = {};

  // Admin may request unpublished drafts
  const isAdminRequest = all === 'true' && req.user && req.user.role === 'admin';
  if (!isAdminRequest) {
    query.isPublished = true;
  }

  // Search keyword in title, description, or tags
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { medium: searchRegex },
      { tags: { $in: [searchRegex] } }
    ];
  }

  // Category filter
  if (category && category !== 'all') {
    // Check if category is slug or ObjectId
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      query.category = category;
    } else {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      }
    }
  }

  // Medium filter
  if (medium && medium !== 'all') {
    query.medium = new RegExp(medium.trim(), 'i');
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.startingPrice = {};
    if (minPrice) query.startingPrice.$gte = Number(minPrice);
    if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'popular') {
    sortOption = { viewCount: -1, createdAt: -1 };
  } else if (sort === 'price-asc') {
    sortOption = { startingPrice: 1 };
  } else if (sort === 'price-desc') {
    sortOption = { startingPrice: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 9);
  const skip = (pageNum - 1) * limitNum;

  const total = await Artwork.countDocuments(query);
  const artworks = await Artwork.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  const totalPages = Math.ceil(total / limitNum);

  return sendSuccess(res, 'Artworks retrieved.', artworks, 200, {
    total,
    page: pageNum,
    pages: totalPages,
    limit: limitNum,
    hasMore: pageNum < totalPages
  });
});

/**
 * @desc    Get featured artworks for homepage
 * @route   GET /api/artworks/featured
 * @access  Public
 */
export const getFeaturedArtworks = asyncHandler(async (req, res) => {
  const featured = await Artwork.find({
    isFeatured: true,
    isPublished: true
  })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(6);

  return sendSuccess(res, 'Featured artworks retrieved.', featured);
});

/**
 * @desc    Get single artwork by slug
 * @route   GET /api/artworks/:slug
 * @access  Public
 */
export const getArtworkBySlug = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findOne({ slug: req.params.slug })
    .populate('category', 'name slug description');

  if (!artwork) {
    return sendError(res, 'Artwork not found.', 404);
  }

  // Increment view count asynchronously
  Artwork.findByIdAndUpdate(artwork._id, { $inc: { viewCount: 1 } }).exec();

  // Fetch related artworks in same category
  const related = await Artwork.find({
    category: artwork.category._id,
    _id: { $ne: artwork._id },
    isPublished: true
  })
    .select('title slug coverImage startingPrice medium dimensions')
    .limit(4);

  return sendSuccess(res, 'Artwork details retrieved.', {
    artwork,
    related
  });
});

/**
 * @desc    Create new artwork
 * @route   POST /api/artworks
 * @access  Private/Admin
 */
export const createArtwork = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    medium,
    dimensions,
    timeTaken,
    startingPrice,
    tags,
    isFeatured,
    isPublished
  } = req.body;

  if (!title || !description || !category || !medium || !dimensions || startingPrice === undefined) {
    return sendError(res, 'Please provide all required artwork fields.', 400);
  }

  let slug = slugify(title);
  const existingSlug = await Artwork.findOne({ slug });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const images = [];
  let coverImage = null;

  // Process uploaded files if any
  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const uploaded = await uploadToCloudinary(file.buffer, 'artchulbul/artworks', file.originalname);
      const isCover = i === 0; // First uploaded image is cover by default
      const imgObj = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        isCover,
        caption: ''
      };
      images.push(imgObj);
      if (isCover) {
        coverImage = { url: uploaded.url, publicId: uploaded.publicId };
      }
    }
  } else if (req.body.coverImageUrl) {
    coverImage = { url: req.body.coverImageUrl, publicId: '' };
    images.push({ url: req.body.coverImageUrl, publicId: '', isCover: true, caption: '' });
  } else {
    return sendError(res, 'Please upload at least one artwork image.', 400);
  }

  // Parse tags
  let parsedTags = [];
  if (tags) {
    parsedTags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(tags) ? tags : [];
  }

  const artwork = await Artwork.create({
    title,
    slug,
    description,
    category,
    medium,
    dimensions,
    timeTaken: timeTaken || '',
    startingPrice: Number(startingPrice),
    images,
    coverImage: coverImage || images[0],
    tags: parsedTags,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isPublished: isPublished !== undefined ? (isPublished === 'true' || isPublished === true) : true
  });

  const populated = await Artwork.findById(artwork._id).populate('category', 'name slug');

  return sendSuccess(res, 'Artwork created successfully.', populated, 201);
});

/**
 * @desc    Update artwork
 * @route   PUT /api/artworks/:id
 * @access  Private/Admin
 */
export const updateArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);

  if (!artwork) {
    return sendError(res, 'Artwork not found.', 404);
  }

  const {
    title,
    description,
    category,
    medium,
    dimensions,
    timeTaken,
    startingPrice,
    tags,
    isFeatured,
    isPublished,
    coverImageIndex
  } = req.body;

  if (title && title !== artwork.title) {
    artwork.title = title;
    artwork.slug = slugify(title);
  }

  if (description !== undefined) artwork.description = description;
  if (category !== undefined) artwork.category = category;
  if (medium !== undefined) artwork.medium = medium;
  if (dimensions !== undefined) artwork.dimensions = dimensions;
  if (timeTaken !== undefined) artwork.timeTaken = timeTaken;
  if (startingPrice !== undefined) artwork.startingPrice = Number(startingPrice);
  if (isFeatured !== undefined) artwork.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isPublished !== undefined) artwork.isPublished = isPublished === 'true' || isPublished === true;

  if (tags !== undefined) {
    artwork.tags = typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : Array.isArray(tags) ? tags : artwork.tags;
  }

  // Append any newly uploaded files
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(file.buffer, 'artchulbul/artworks', file.originalname);
      artwork.images.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        isCover: false,
        caption: ''
      });
    }
  }

  // Allow re-assigning cover image index
  if (coverImageIndex !== undefined && artwork.images[Number(coverImageIndex)]) {
    const idx = Number(coverImageIndex);
    artwork.images.forEach((img, i) => {
      img.isCover = i === idx;
    });
    artwork.coverImage = {
      url: artwork.images[idx].url,
      publicId: artwork.images[idx].publicId
    };
  }

  await artwork.save();
  const populated = await Artwork.findById(artwork._id).populate('category', 'name slug');

  return sendSuccess(res, 'Artwork updated successfully.', populated);
});

/**
 * @desc    Delete artwork
 * @route   DELETE /api/artworks/:id
 * @access  Private/Admin
 */
export const deleteArtwork = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);

  if (!artwork) {
    return sendError(res, 'Artwork not found.', 404);
  }

  // Delete all Cloudinary assets associated with this artwork
  for (const img of artwork.images) {
    if (img.publicId) {
      await deleteFromCloudinary(img.publicId);
    }
  }

  await artwork.deleteOne();

  return sendSuccess(res, 'Artwork deleted successfully.');
});
