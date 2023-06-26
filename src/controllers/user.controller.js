
const { UserService } = require('../services');
const { CurrentUserDTO } = require('../dto')
const { Logger, ROLES } = require('../helpers')

class UserController {
    uploadDocuments = async (req,res)=> {

    }
    
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
    
    updateRole = async (req, res) => {
        if (!req.user) {
            return res.status(400).send({ status: "error", error: "You need to be logged in to see this" });
        }
        if (req.user.role !== ROLES.ADMIN) {
            return res.status(401).send({ status: "error", error: "You don't have permissions to change user role" });
        }
        const { uid } = req.params;
        if (!uid || typeof (uid) != 'string') {
            return res.status(400).json({
                message: `id type is not correct for uid`,
                products: null,
            });
        }
        
        try {
            const user = await UserService.getUserById(uid);
            if (user && user.role !== ROLES.ADMIN) {
                const newRole = user.role === ROLES.USER ? ROLES.PREMIUM : ROLES.USER
                const updatedUserRole = await UserService.updateRole(uid, newRole);
                if(updatedUserRole) {
                    return res.status(200).json({
                        message: `User role updated successfully`,
                        user: updatedUserRole,
                    });
                }
            }
            return res.status(400).json({
                error: `User not found successfully`,
                user: null,
            });
        } catch (error) {
            Logger.error("🚀 Error getting user with uid", uid, 'Error:', error )
        }
    };

   
}

module.exports = UserController;