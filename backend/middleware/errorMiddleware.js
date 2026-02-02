/**
 * Middleware to handle requests for routes that do not exist.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * General error handling middleware.
 * This catches any errors that occur in the route handlers.
 */
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come in with a 200 status code, so we set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Show the stack trace only if we are not in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
