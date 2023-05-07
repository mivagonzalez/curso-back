const Errors = require('../services/errors/errors');

const handleErrors = (error, _, res, _) => {
    console.log(error.cause);
    switch(error.code) {
        case (Errors.DATABASE_ERROR):
            res.send({ status: 'error', error: error.name });
            break;
        default:
            res.send({ status: 'error', error: 'Unhandled Error' });
    }
}


module.exports = handleErrors;