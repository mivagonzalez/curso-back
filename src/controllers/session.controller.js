
const { UserService } = require('../services');
const { CurrentUserDTO } = require('../dto')
const { Logger } = require('../helpers')

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
        res.redirect('/login')
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
}

module.exports = SessionController;