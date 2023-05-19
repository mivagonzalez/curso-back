const {ERRORS } = require('../services/errors/errors')

const handleErrors = (error, _, res, _1) => {
    console.log(error.cause);
    switch(error.name) {
        case (ERRORS.DATABASE_ERROR.name):
            res.send({ status:"error", Error: ERRORS.DATABASE_ERROR.name,code: error.code, message: error.message, payload: null });
            break;
        case (ERRORS.ROUTING_ERROR.name):
            res.send({ status:"error", Error: ERRORS.ROUTING_ERROR.name,code: error.code, message: error.message, payload: null });
            break;
        case (ERRORS.INVALID_TYPES_ERROR.name):
            res.send({ status:"error", Error: ERRORS.INVALID_TYPES_ERROR.name,code: error.code, message: error.message, payload: null});
            break;
        case (ERRORS.INVALID_PARAMETER_ERROR.name):
            res.send({ status:"error", Error: ERRORS.INVALID_PARAMETER_ERROR.name,code: error.code, message: error.message, payload: null});
            break;
        case (ERRORS.CREATION_ERROR.name):
            res.send({ status:"error", Error: ERRORS.CREATION_ERROR.name,code: error.code, message: error.message, payload: null});
            break;
        case (ERRORS.INVALID_PARAMETER_ERROR):
            res.send({ status: 'error', error: error.name, cause: error.cause, message: error.message });
        case (ERRORS.ROUTING_ERROR):
            res.send({ status: 'error', error: error.name, cause: error.cause, message: error.message });
        default:
            res.send({ status:"error", Error: 'error', error: 'Unhandled Error' });
    }
}


module.exports = handleErrors;