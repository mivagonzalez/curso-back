
const { UserService, RestorePasswordRequestService } = require('../services');
const { CurrentUserDTO } = require('../dto')
const { Logger, ROLES } = require('../helpers')
const { createHash, arePasswordsEqual } = require('../utils')
class SessionController {

    logout = async (req, res) => {
        req.session.destroy((err) => {
            if (!err) return res.redirect("/login");
            return res.send({ message: `logout Error`, body: err });
        });
    };

    faillogin = (_, res) => {
        Logger.error("invalid credentials");
        res.redirect('/faillogin')
    };

    current = async (req, res) => {
        if (!req.user) {
            return res.status(400).send({ status: "error", error: "You need to be logged in to see this" });
        }
        
        try {
            const user = await UserService.getUser(req.user.email);
            if (user) {
                const userDto = new CurrentUserDTO(user)
                return res.status(200).json({
                    message: `User Found successfully`,
                    user: userDto,
                });
            }
            return res.status(400).json({
                error: `User not found successfully`,
                user: null,
            });
        } catch (error) {
            Logger.error("🚀 Error getting user with mail", mail, 'Error:', error )
        }
    };

    register = async (req, res) => {
        delete req.user.password
        req.session.user = req.user;
        res.redirect('/products')
    }

    failRegister = async (req, res) => {
        res.redirect('/register')
    };

    login = async (req, res) => {
        try {
            if (!req.user) {
                return res.status(400).send({ status: "error", error: "invalid credentials" });
            }
            delete req.user.password
            req.session.user = req.user;
            if(req.user.role === ROLES.ADMIN) {
                return res.redirect('/admin');
            }
            return res.redirect('/products');
        } catch (error) {
            Logger.error(
                "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
                error
            );
        }
    };

    githubCallback = async (req, res) => {
        try {
            delete req.user.password;
            req.session.user = req.user;
            res.redirect("/products");
        } catch (error) {
            Logger.error("🚀 ~ file: session.routes.js:115 ~ error:", error);
        }
    }

    createRestorePasswordRequest = async (req, res) => {
        try {
            const { email } = req.body;
            if (!email || typeof (email) !== "string" || email.length < 5) {
                throw Error("El email ingresado es incorrecto");
            }
            const user = await UserService.getUser(email);
            if(user && user._id) {
                const restorePasswordRequest = await RestorePasswordRequestService.getRestorePasswordRequest(user._id)
                if(restorePasswordRequest && restorePasswordRequest.expiresAt > Date.now()) {
                    Logger.info("The restore password email is already sent")
                    return res.render("restore-PW-mail-sent")
                }
                await RestorePasswordRequestService.createRequest(user._id);
                await RestorePasswordRequestService.sendRestorePasswordMail(email, user._id)
                Logger.info("Restore password mail created")
            }else {
                Logger.warning("The user does not exist")
            }
            return res.render("restore-PW-mail-sent")
        } catch (error) {
            Logger.error("🚀 ~ file: session.routes.js:115 createRestorePasswordRequest ~ error:", error);
            return res.status(400).json({
                message: `Password was not updated`,
                status: "Error",
                error: error
            });
        }
    }

    restorePassword = async (req, res) => {
        try {
            const { password } = req.body;
            const { userId } = req.params;

            if (!password || typeof (password) !== "string" || password.length < 8) {
                return res.status(400).json({
                    message: `password is not valid`,
                    status:"Error",
                    password: password,
                });
            }
            const user = await UserService.getUserById(userId);
            if(!user) {
                return res.status(400).json({
                    message: `user does not exist`,
                    status: "Error",
                });
            }
            const passwordsEqual = arePasswordsEqual(user.password, password)
            if(passwordsEqual) {
                return res.status(400).json({
                    message: `The new password is equal to the current password`,
                    status: "Error",
                });
            }
            const encriptedPassword = createHash(password);
            const updatedUser = await UserService.updateUserPassword(userId, encriptedPassword)
            if(updatedUser) {
                await RestorePasswordRequestService.deleteRequest(userId);
                return res.redirect('/passwordRestored')
            }
            return res.status(400).json({
                message: `Password was not updated`,
                status: "Error",
            });
        } catch (error) {
            return res.status(400).json({
                message: `Password was not updated`,
                status: "Error",
                error: error
            });
        }
    }
}

module.exports = SessionController;