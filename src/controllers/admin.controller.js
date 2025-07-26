import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import constants from '../config/constants.js';
import { createAuthorService } from '../services/admin.service.js';
import responseHandler from '../utils/responseHandler.js';

// create author
const createAuthor = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email)
        return next(
            new AppError(constants.BAD_REQUEST, 'All Fields are required')
        );

    await createAuthorService({ email });

    responseHandler(res, constants.OK, 'success', 'The user is now an author');
});

export { createAuthor };
