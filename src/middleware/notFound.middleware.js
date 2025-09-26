// src/middleware/notFound.middleware.js
module.exports = function notFound(req, res) {
  res.status(404).json({ error: { message: 'Resource not found' } });
};