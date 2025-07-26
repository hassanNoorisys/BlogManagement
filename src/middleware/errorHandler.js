import responseHandler from '../utils/responseHandler.js';

const errorHandler = (err, req, res, next) => {
    console.log('stack -->', err.stack);
    console.log('\n message -->', err.message);

    console.log('status code -->', err.statusCode);
    const statusCode = err.statusCode;
    const status = 'fail';
    const message = err.message;

    responseHandler(res, statusCode, status, message);
};

export default errorHandler;
