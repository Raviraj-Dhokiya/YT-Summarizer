/**
 * Global error handling middleware.
 * Catches any unhandled errors passed via next(err) in routes.
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Unhandled Error:', err.stack || err.message);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
