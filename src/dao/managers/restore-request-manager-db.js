const restoreRequestsModel = require("../models/restore-requests.model");
const {ERRORS, CustomError } = require('../../services/errors/errors')
const { Logger } = require('../../helpers');


class RestorePaswordRequestManager {

    createRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return await restoreRequestsModel.create({user: userId});
        } catch (error) {
            Logger.error("🚀 Error creating Pasword restore request:", error)
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create restore password request', ERRORS.CREATION_ERROR.code)
        }
    }

    getRestorePasswordRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return await restoreRequestsModel.findOne({ user:userId }) ?? null;
        } catch (error) {
            Logger.error("🚀 Error getting Pasword restore request:", error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get restore password request', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
    
    deleteRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return await restoreRequestsModel.deleteOne({ user:userId }) ?? null;
        } catch (error) {
            Logger.error("🚀 Error deletting request:", error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not relete request', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
};

module.exports = RestorePaswordRequestManager;