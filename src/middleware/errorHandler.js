import logger from '../config/logger.js';
import responseHandler from '../utils/responseHandler.js';

const errorHandler = (err, req, res, next) => {

    console.log('stack -->', err.stack);
    console.log('message -->', err.message);

    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Internal Server Error';

    if (err.isOperational || err instanceof AppError) {
        logger.warn(err.message, { extra: err.stack });
    } else {
        logger.error(err.message, { stack: err.stack });
    }

    responseHandler(res, statusCode, status, message);
};

export default errorHandler;
