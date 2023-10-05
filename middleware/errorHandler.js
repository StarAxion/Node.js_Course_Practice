const errorHandler = (err, req, res, next) => {
  const serverErrStatus = 500;
  err.status = err.status || serverErrStatus;
  err.message = err.message || 'An unexpected error occurred on the server';
  if (err.status === serverErrStatus) {
    console.error(err.stack);
  }
  res.status(err.status).json({ 
    status: err.status,
    message: err.message
  });
}

module.exports = errorHandler;
