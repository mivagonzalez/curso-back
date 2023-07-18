const userModel = require("../models/user.model");
const {ERRORS, CustomError } = require('../../services/errors/errors')
const { Logger, ROLES } = require('../../helpers');
const { sendMail } = require('../../helpers')

sendDeleteInactiveUserMail = async (email, username, lastConnection) => {
    const subject = "Usuario eliminado por Inactividad";
    const html = `
    <div>
      <h1>Eliminamos tu ususario por inactividad</h1>
      <p>Detectamos que no accedias a tu cuenta ${username} desde ${lastConnection}</p>
      <p>Es por esto que eliminamos tu cuenta por inactividad</p>
      <p>Muchas gracias!</p>
    </div>
    `;
    return await sendMail(email,subject,html);
  }
class UserManager {

    getAllUsers = async () => {
        try {
            const users =  await userModel.find();
            return users;
        } catch (error) {
            Logger.error("🚀 Error getting all users in manager", error);
            CustomError.createError(ERRORS.DATABASE_ERROR.name,'','Can not get all users', ERRORS.DATABASE_ERROR.code)
        }
    }

    getUser = async (email = '') => {
        if (!email || typeof (email) !== "string" || email.length < 5) {
            throw Error("El email ingresado es incorrecto");
        }
        try {
            const user =  await userModel.findOne({ email }).populate('cart');
            return user
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUser=async ~ error:", error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided email ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    getUserById = async (id = '') => {
        if (!id || (typeof (id) !== "string" && typeof(id) !== "object") || id.length < 5) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await userModel.findById(id).populate('cart');
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ getUserById=async ~ error:", error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided id ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    addUser = async ({email, first_name, last_name, age, password, address, cart, role = ROLES.USER }) => {
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
    
    updateRole = async (userId, newRole) => {
        try {
            if (!newRole || typeof (newRole) !== "string" || !Object.values(ROLES).includes(newRole)) {
                throw Error("El rol ingresado es invalido");
            }
            const user = await this.getUserById(userId);
            if(!user) {
                throw Error("El usuario ingresado no existe");
            }
            return await userModel.findOneAndUpdate({_id: userId}, {role: newRole},{new: true})
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ addUser=async ~ error:", error);

            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not change Role', ERRORS.CREATION_ERROR.code)
        }
    }

    updateLastLogIn = async (userId) => {
        try {
            return await userModel.updateOne({ _id: userId }, { $set: { last_connection: Date.now() }});
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ updateLastLogIn=async ~ error:", error);
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not set last connection', ERRORS.CREATION_ERROR.code)
        }
    }

    updateDocuments = async (userId, docs) => {
        try {
            if (!userId ) {
                throw Error("No se envio ningun userId");
            }
            if (!docs ) {
                return null;
            }
            const user = await this.getUserById(userId);
            if(!user) {
                throw Error("El usuario ingresado no existe");
            }
            const requiredDocumentsNames = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const uploadedDocuments = docs.filter(doc => doc.reference.includes('\\documents\\'));
            const uploadedDocumentNames = uploadedDocuments.map(doc => doc.name);
            const allRequiredDocumentsUploaded = requiredDocumentsNames.every(requiredName => 
                uploadedDocumentNames.some(uploadedName => uploadedName.includes(requiredName)));
            
            let docsToUpdate = {
                documents: docs,
                is_validated: allRequiredDocumentsUploaded
            }

            return await userModel.updateOne({ _id: userId }, { $set: docsToUpdate},{ new: true })
        } catch (error) {
            Logger.error("🚀 Error on updateDocuments on user manager: ", error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not updateDocuments', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    deleteInactiveUsers = async () => {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
            const users = await userModel.find({
                last_connection: {
                    $lt: twoDaysAgo,
                }
            });
            for (const user of users) {
                await sendDeleteInactiveUserMail(user.email,user.email,user.last_connection)
                const deleted = await userModel.deleteOne(user._id);
                if(!deleted) {
                    return false
                }
            }
            return true;
        } catch (error) {
            Logger.error("🚀 ~ file: User.manager.js:21 ~ UserManager ~ addUser=async ~ error:", error);
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not change Role', ERRORS.CREATION_ERROR.code)
            return false;
        }
    }
};

module.exports = UserManager;