// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// 404 Handler Middleware
const notFoundHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`Route not found - ${req.originalUrl}`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
