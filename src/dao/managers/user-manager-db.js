const userModel = require("../models/user.model");


class UserManager {

    getUser = async (email = '') => {
        if (!email || typeof (email) !== "string" || email.length < 5) {
            throw Error("El email ingresado es incorrecto");
        }
        try {
            return await userModel.findOne({ email }).populate('cart');
        } catch (error) {
            console.log(
                "🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUser=async ~ error:",
                error
            );
            return null
        }
    }
    getUserById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 5) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await userModel.findById(id).populate('cart');
        } catch (error) {
            console.log(
                "🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUserById=async ~ error:",
                error
            );
            return null
        }
    }

    addUser = async ({email, first_name, last_name, age, password, address, cart, role = 'user'}) => {
        try {
            return await userModel.create({email, password, first_name, last_name, age, password, address, cart, role});
        } catch (error) {
            console.log(
                "🚀 ~ file: User.manager.js:21 ~ UserManager ~ add=async ~ error:",
                error
            );
            return null
        }
    }


};

module.exports = UserManager;