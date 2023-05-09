const { ERRORS } = require('../services/errors');

const handleErrors = (error, _, res, _1) => {
    console.log(error.cause);
    switch (error.code) {
        case (ERRORS.DATABASE_ERROR):
            res.send({ status: 'error', error: error.name, cause: error.cause, message: error.message });
            break;
        case (ERRORS.INVALID_PARAMETER_ERROR):
            res.send({ status: 'error', error: error.name, cause: error.cause, message: error.message });
        case (ERRORS.ROUTING_ERROR):
            res.send({ status: 'error', error: error.name, cause: error.cause, message: error.message });
        default:
            res.send({ status: 'error', error: 'Unhandled Error' });
    }
}


module.exports = handleErrors;