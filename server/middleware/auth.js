import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendError } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check httpOnly cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Check Authorization header fallback (Bearer <token>)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Authentication required. Please log in.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_chulbul_art');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'The user belonging to this token no longer exists.', 401);
    }

    if (user.isBlocked) {
      return sendError(res, 'Your account has been deactivated. Please contact support.', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired session. Please log in again.', 401);
  }
};

/**
 * Optional authentication: if token is present, populate req.user; otherwise proceed without error.
 */
export const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_chulbul_art');
    const user = await User.findById(decoded.id).select('-password');
    if (user && !user.isBlocked) {
      req.user = user;
    }
  } catch (err) {
    // Ignore error for optional protect
  }
  next();
};

/**
 * Authorize specific roles (e.g. 'admin')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user ? req.user.role : 'unauthorized'}' is not authorized to access this route.`,
        403
      );
    }
    next();
  };
};
