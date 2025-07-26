class AppError extends Error {
  constructor(statusCode = 500, message) {
    super(message);
    this.status = statusCode < 4 ? 'fail' : 'error';
    this.statusCode = statusCode || 500;
    this.message = message || 'Internal Server Error';
    this.isOperational = true;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
