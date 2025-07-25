import responseHandler from '../utils/responseHandler.js';

const errorHandler = (err, req, res, next) => {
  console.log('stack -->', err.stack);
  console.log('\n message -->', err.message);

  const statusCode = err.statusCode;
  const status = err.status;
  const message = err.message;

  responseHandler(res, statusCode, status, message);
};

export default errorHandler;
