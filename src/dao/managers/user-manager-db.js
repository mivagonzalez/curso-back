const userModel = require("../models/user.model");
const {ERRORS, CustomError } = require('../../services/errors/errors')
const { Logger } = require('../../helpers');


class UserManager {

    getUser = async (email = '') => {
        if (!email || typeof (email) !== "string" || email.length < 5) {
            throw Error("El email ingresado es incorrecto");
        }
        try {
            return await userModel.findOne({ email }).populate('cart');
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUser=async ~ error:", error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided email ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    getUserById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 5) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await userModel.findById(id).populate('cart');
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUserById=async ~ error:", error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided id ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    addUser = async ({email, first_name, last_name, age, password, address, cart, role = 'user'}) => {
        try {
            return await userModel.create({email, password, first_name, last_name, age, password, address, cart, role});
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ addUser=async ~ error:", error);

            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create new user', ERRORS.CREATION_ERROR.code)
        }
    }

    updateUserPassword = async (userId, newPassword) => {
        try {
            if (!newPassword || typeof (newPassword) !== "string" || newPassword.length < 8) {
                throw Error("El password ingresado es invalido");
            }
            const user = await this.getUserById(userId);
            if(!user) {
                throw Error("El usuario ingresado no existe");
            }
            return await userModel.updateOne({_id: userId}, {password: newPassword})
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ addUser=async ~ error:", error);

            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create new user', ERRORS.CREATION_ERROR.code)
        }
    }

};

module.exports = UserManager;