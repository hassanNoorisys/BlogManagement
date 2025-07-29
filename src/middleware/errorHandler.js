import responseHandler from '../utils/responseHandler.js';

const errorHandler = (err, req, res, next) => {
    console.log('stack -->', err.stack);
    console.log('message -->', err.message);

    // fallback for unexpected errors
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';

    responseHandler(res, statusCode, status, message);
};

export default errorHandler;
