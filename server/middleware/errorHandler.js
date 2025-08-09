// errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err); // Log error here or send it to monitoring services
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;