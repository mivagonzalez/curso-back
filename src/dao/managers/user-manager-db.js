const userModel = require("../models/user.model");


class UserManager {

    getuser = async (email = '') => {
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
    addUser = async ({email, password, first_name, last_name, age, password, address, cart}) => {
        try {
            return await userModel.create({email, password, first_name, last_name, age, password, address, cart});
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