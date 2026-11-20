export const sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const payload = {
    success,
    message,
    data
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(statusCode).json(payload);
};

export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200, meta = null) => {
  return sendResponse(res, statusCode, true, message, data, meta);
};

export const sendError = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};
