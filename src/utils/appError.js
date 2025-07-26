class AppError extends Error {
    constructor(statusCode = 500, message) {
        super(message);
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.statusCode = statusCode;
        this.message = message || 'Internal Server Error';
        this.isOperational = true;
        this.success = false;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
