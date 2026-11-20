import User from '../models/User.js';
import Artwork from '../models/Artwork.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Add delivery address
 * @route   POST /api/users/addresses
 * @access  Private (Customer)
 */
export const addAddress = asyncHandler(async (req, res) => {
  const { recipientName, phone, street, city, state, postalCode, country, isDefault } = req.body;

  if (!recipientName || !phone || !street || !city || !state || !postalCode) {
    return sendError(res, 'Please provide all required address fields.', 400);
  }

  const user = await User.findById(req.user.id);

  // If this is the first address or marked isDefault, reset other addresses
  const shouldBeDefault = isDefault || user.addresses.length === 0;

  if (shouldBeDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  const newAddress = {
    recipientName: recipientName.trim(),
    phone: phone.trim(),
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    postalCode: postalCode.trim(),
    country: country ? country.trim() : 'India',
    isDefault: shouldBeDefault
  };

  user.addresses.push(newAddress);
  await user.save();

  return sendSuccess(res, 'Address added successfully.', user.addresses, 201);
});

/**
 * @desc    Update delivery address
 * @route   PUT /api/users/addresses/:id
 * @access  Private (Customer)
 */
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    return sendError(res, 'Address not found.', 404);
  }

  const { recipientName, phone, street, city, state, postalCode, country, isDefault } = req.body;

  if (recipientName) address.recipientName = recipientName.trim();
  if (phone) address.phone = phone.trim();
  if (street) address.street = street.trim();
  if (city) address.city = city.trim();
  if (state) address.state = state.trim();
  if (postalCode) address.postalCode = postalCode.trim();
  if (country) address.country = country.trim();

  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });
  }

  await user.save();
  return sendSuccess(res, 'Address updated successfully.', user.addresses);
});

/**
 * @desc    Delete delivery address
 * @route   DELETE /api/users/addresses/:id
 * @access  Private (Customer)
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    return sendError(res, 'Address not found.', 404);
  }

  const wasDefault = address.isDefault;
  user.addresses.pull(req.params.id);

  // If deleted address was default and there are other addresses, make first one default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return sendSuccess(res, 'Address removed.', user.addresses);
});

/**
 * @desc    Set address as default
 * @route   PATCH /api/users/addresses/:id/default
 * @access  Private (Customer)
 */
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    return sendError(res, 'Address not found.', 404);
  }

  user.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === req.params.id;
  });

  await user.save();
  return sendSuccess(res, 'Default address updated.', user.addresses);
});

/**
 * @desc    Get user's wishlist artworks
 * @route   GET /api/users/wishlist
 * @access  Private (Customer)
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
    populate: { path: 'category', select: 'name slug' }
  });

  return sendSuccess(res, 'Wishlist fetched.', user.wishlist || []);
});

/**
 * @desc    Toggle artwork in user wishlist
 * @route   POST /api/users/wishlist/:artworkId
 * @access  Private (Customer)
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { artworkId } = req.params;
  const artwork = await Artwork.findById(artworkId);

  if (!artwork) {
    return sendError(res, 'Artwork not found.', 404);
  }

  const user = await User.findById(req.user.id);
  const index = user.wishlist.indexOf(artworkId);

  let isWishlisted = false;
  if (index > -1) {
    user.wishlist.splice(index, 1);
    isWishlisted = false;
  } else {
    user.wishlist.push(artworkId);
    isWishlisted = true;
  }

  await user.save();
  return sendSuccess(res, isWishlisted ? 'Added to wishlist.' : 'Removed from wishlist.', {
    isWishlisted,
    wishlistCount: user.wishlist.length
  });
});
