import constants from '../config/constants.js';
import responseHandler from '../utils/responseHandler.js';

const verifyRole = (...allowdRoles) => {
    return (req, res, next) => {

        if (!allowdRoles.includes(req.user.role))

            return responseHandler(
                res,
                constants.UNAUTHORIZED,
                'fail',
                'Unauthorized'
            );


        next();
    };
};

export default verifyRole;
