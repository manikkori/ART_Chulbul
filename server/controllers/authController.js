import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/email.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// Generate JWT and attach cookie
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret_chulbul_art',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isProduction, // HTTPS required in production for cross-site cookies
    sameSite: isProduction ? 'none' : 'lax'
  };

  res.cookie('token', token, cookieOptions);

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    addresses: user.addresses || [],
    wishlist: user.wishlist || [],
    createdAt: user.createdAt
  };

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: userSafe
  });
};

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 'Please provide name, email, and password.', 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return sendError(res, 'An account with this email already exists.', 400);
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: 'customer'
  });

  sendTokenResponse(user, 201, res, 'Registration successful. Welcome to Chulbul\'s Art!');
});

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 'Please provide an email and password.', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  if (user.isBlocked) {
    return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 'Invalid email or password.', 401);
  }

  sendTokenResponse(user, 200, res, 'Login successful.');
});

/**
 * @desc    Log out current user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });

  return sendSuccess(res, 'Logged out successfully.');
});

/**
 * @desc    Get currently logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist', 'title coverImage startingPrice medium dimensions slug');
  return sendSuccess(res, 'User profile fetched.', user);
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return sendError(res, 'Please provide your email address.', 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // For security, still return generic success message so emails cannot be enumerated
    return sendSuccess(res, 'If an account exists with that email, a password reset link has been dispatched.');
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `You requested a password reset for your Chulbul's Art account.\n\nPlease click on the following link or paste it into your browser to choose a new password:\n\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #ebdcd0; border-radius: 12px; background-color: #fdf7f1;">
      <h2 style="color: #c86d51; margin-bottom: 16px;">Chulbul's Art Password Reset</h2>
      <p style="color: #2d2421; font-size: 15px; line-height: 1.6;">Hello ${user.name},</p>
      <p style="color: #2d2421; font-size: 15px; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="margin: 24px 0;">
        <a href="${resetUrl}" style="background-color: #c86d51; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 9999px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #786b65; font-size: 13px;">This link will expire in 60 minutes. If you did not request this, you can safely ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset your Chulbul's Art Password",
    text: message,
    html
  });

  return sendSuccess(res, 'If an account exists with that email, a password reset link has been dispatched.');
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return sendError(res, 'Password reset token is invalid or has expired.', 400);
  }

  if (!req.body.password || req.body.password.length < 6) {
    return sendError(res, 'Please provide a new password of at least 6 characters.', 400);
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successfully. You are now logged in.');
});

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {};
  if (req.body.name) fieldsToUpdate.name = req.body.name.trim();

  // If avatar file was uploaded
  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, 'artchulbul/avatars', req.file.originalname);
    fieldsToUpdate.avatar = {
      url: uploaded.url,
      publicId: uploaded.publicId
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  return sendSuccess(res, 'Profile updated successfully.', updatedUser);
});

/**
 * @desc    Update user password
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return sendError(res, 'Please provide current and new password.', 400);
  }

  if (newPassword.length < 6) {
    return sendError(res, 'New password must be at least 6 characters.', 400);
  }

  const user = await User.findById(req.user.id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return sendError(res, 'Current password does not match.', 400);
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully.');
});
