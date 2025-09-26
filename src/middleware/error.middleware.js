// src/middleware/error.middleware.js
module.exports = function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const payload = {
    error: {
      message: err.message || 'Internal Server Error'
    }
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
};