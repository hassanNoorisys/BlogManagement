const responseHandler = (res, statusCode, status, message, data = null) => {
    let response = { status };

    if (data) response.data = data;
    if (message) response.message = message;

    res.status(statusCode).json(response);
};

export default responseHandler;
