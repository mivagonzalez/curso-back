
const { UserService } = require('../services');
const { CurrentUserDTO } = require('../dto')
const { Logger, ROLES } = require('../helpers')

class UserController {

    getAllUsers = async (_, res) => {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                users: users,
                ok: true,
                message: "Usuarios obtenidos correctamente"
            })
        } catch (error) {
            Logger.error(
                "🚀 Error getting all users in controller",
                error
                );
            return res.status(400).json({
                ok: false,
                message: "No se pudieron obtener los usuarios correctamente",
                error: error
            })
        }
    }

    uploadDocuments = async (req,res)=> {
        const { uid } = req.params;
        if (!uid || typeof (uid) != 'string' || uid.length < 5) {
            return res.status(400).json({
                error: `id type is not correct for uid`,
            });
        }
        if(!req.user._id.equals(uid)) {
            return res.status(403).json({ error: 'No está autorizado para realizar esta acción.' });
        }
        const user = await UserService.getUserById(uid);

        if(!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        if (!req.files.documents && !req.files.profile && !req.files.product) {
            return res.status(400).json({ error: 'No se recibio ningun archivo' });
        }
        const documents = req.files.documents ? req.files.documents.map(file => ({ name: file.originalname, reference: file.path })) : [];
        const profiles = req.files.profile ? req.files.profile.map(file => ({ name: file.originalname, reference: file.path })) : [];
        const products = req.files.product ? req.files.product.map(file => ({ name: file.originalname, reference: file.path })) : [];
        const allFiles = [...documents, ...profiles, ...products];
        const updatedDocuments = [...user.documents, ...allFiles];
        const updateResult = await UserService.updateDocuments(uid, updatedDocuments);

        if(!updateResult) {
            return res.status(404).json({ error: 'No se pudieron subir los documentos' });
        }

        return res.status(200).json({
            error: `Documentos subidos exitosamente`,
            docs: updatedDocuments,
        });

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
                    error: `User Found successfully`,
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
                error: `id type is not correct for uid`,
                products: null,
            });
        }
        
        try {
            const user = await UserService.getUserById(uid);
            if (user && user.role !== ROLES.ADMIN) {
                const newRole = user.role === ROLES.USER ? ROLES.PREMIUM : ROLES.USER
                if(newRole === ROLES.PREMIUM && !user.is_validated) {
                    return res.status(400).json({
                        error: `El usuario no ha terminado de procesar su documentacion.`,
                        user: user
                    });
                }
                const updatedUserRole = await UserService.updateRole(uid, newRole);
                if(updatedUserRole) {
                    return res.status(200).json({
                        error: `User role updated successfully`,
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

    deleteInactiveusers = async (req,res) => {
        try {
            const deleted = await UserService.deleteInactiveUsers();
            if (deleted) {
                return res.status(200).json({
                    ok: true,
                    message: "Usuarios eliminados correctamente"
                })
            }
            return res.status(400).json({
                ok: false,
                message: "Usuarios no eliminados"
            })
        } catch (error) {
            Logger.error(
                "🚀 Error getting all users in controller",
                error
                );
            return res.status(400).json({
                ok: false,
                message: "Usuarios no eliminados",
                error: error
            })
        }
    }
}

module.exports = UserController;