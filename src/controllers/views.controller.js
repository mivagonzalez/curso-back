const { ProductsService, CartService, UserService, RestorePasswordRequestService } = require('../services')
const { Logger, ROLES } = require('../helpers')

class ViewsController {

    validateCIDParam = async (req, res, next, pid) => {
        const { cid } = req.params;
        if (!cid || !isNaN(cid) || cid.length < 1) {
            return res.render('products', { products: [] });
        }
        next();
    };

    getCart = async (req, res) => {
        const { cid } = req.params;
        const session = req.session;
        const findUser = await UserService.getUser(session.user.email);
        const products = await CartService.getProductsByCart(cid)
        const mappedProducts = products.map((prod) => {
            return {
                productId: prod.product?.productId,
                title: prod.product?.title,
                description: prod.product?.description,
                code: prod.product?.code,
                stock: prod.product?.stock,
                category: prod.product?.category,
                status: prod.product?.status,
                price: prod.product?.price,
                id: prod.product?._id,
                quantity: prod?.quantity
            };
        });
        let cart = {
            style: 'index',
            products: mappedProducts,
            first_name: req.session?.user?.first_name || findUser.first_name,
            last_name: req.session?.user?.last_name || findUser.last_name,
            email: req.session?.user?.email || email,
        }

        return res.render('cart', cart);
    };

    getProducts = async (req, res) => {
        const { page: reqPage } = req.query;
        const session = req.session;
        const findUser = await UserService.getUser(session.user.email);
        let page;
        if (!reqPage || isNaN(reqPage)) {
            page = 1;
        } else {
            page = Number(reqPage)
        }

        const {
            docs: products,
            limit: limitPag,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            page: currentPage
        } = await ProductsService.getProducts(10, page, null, null);

        let total_cart_products = 0;

        findUser.cart.products.forEach(product => {
            total_cart_products += product.quantity
        });
        const mappedProducts = products.map((prod) => {
            return {
                id: prod.productId,
                title: prod.title,
                description: prod.description,
                code: prod.code,
                stock: prod.stock,
                category: prod.category,
                status: prod.status,
                price: prod.price,
                thumbnails: prod.thumbnails
            };
        });
        let testProduct = {
            style: 'index',
            products: mappedProducts,
            currentPage: currentPage,
            firstPage: 1,
            lastPage: totalPages,
            hasNextPage: hasNextPage,
            hasPrevPage: hasPrevPage,
            nextPage: `/products?page=${nextPage}`,
            prevPage: `/products?page=${prevPage}`,
            lastPage: `/products?page=${totalPages}`,
            firstPage: `/products?page=${1}`,
            isNotInLastPage: currentPage !== totalPages,
            isNotInFirstPage: currentPage !== 1,
            first_name: req.session?.user?.first_name || findUser.first_name,
            last_name: req.session?.user?.last_name || findUser.last_name,
            email: req.session?.user?.email || findUser.email,
            age: req.session?.user?.age || findUser.age,
            cartId: req.session?.user?.cart?.cartId || findUser.cart.cartId,
            total_cart_products: total_cart_products
        }
        return res.render('products', testProduct);
    };

    getUsers = async (req, res) => {
        const users = await UserService.getAllUsers();
        const currentUser = await UserService.getUser(req.user.email);
        const mappedUsers = users.map((user) => {
            debugger
            return {
                id: user._id,
                firstName: user.first_name || user.email,
                lastName: user.last_name || '',
                age: user.age || '',
                role: user.role,
                email: user.email
            };
        });
        const data = {
            users: mappedUsers,
            first_name: req.session?.user?.first_name || currentUser.first_name,
            last_name: req.session?.user?.last_name || currentUser.last_name,
            email: req.session?.user?.email || currentUser.email,
            style: 'index',
        }
        
        return res.render('admin-console', data);
    };

    getUser = async (req, res) => {
        const { uid } = req.params;
        const user = await UserService.getUserById(uid);

        const data = {
            id: user._id,
            firstName: user.first_name || user.email,
            lastName: user.last_name || '',
            age: user.age || '',
            role: user.role,
            userEmail: user.email,
            email: req.user.email,
            canModifyRole: user.role === ROLES.PREMIUM || (user.role === ROLES.USER && user.is_validated),
            canDelete: user.role !== ROLES.ADMIN && user._id !== req.user._id,
            style: 'index'
        };        
        return res.render('user-admin', data);
    };

    getRealTimeProducts = async (_, res) => {
        try {
            const products = await ProductsService.getProducts();
            if (products && products.docs) {
                const mappedProducts = products.docs.map((prod) => {
                    return {
                        id: prod.productId,
                        title: prod.title,
                        description: prod.description,
                        code: prod.code,
                        stock: prod.stock,
                        category: prod.category,
                        status: prod.status,
                        price: prod.price,
                        thumbnails: prod.thumbnails
                    };
                });
                let testProduct = {
                    style: 'index',
                    products: mappedProducts
                }
                return res.render('real-time-products', testProduct);
            }
            return res.json({
                ok: true,
                message: "No existen productos"
            });
        } catch (error) {
            return res.json({
                ok: false,
                message: "Error al intentar obtener los productos"
            });
        }
    };

    getChat = async (_, res) => {
        try {
            return res.render('chat', { style: 'chat' });
        } catch (error) {
            return res.json({
                ok: false,
                message: "Error al intentar obtener los mensajes"
            });
        }
    };

    getLogin = async (req, res) => {
        try {
            return res.render('login');
        } catch (error) {
            Logger.error("Error al ingresar al login", error)
        }
    };

    getRegister = async (req, res) => {
        res.render("register");
    };

    getFailLogin = async (req, res) => {
        res.render("fail-login");
    };

    getRestorePasswordMail = (req, res) => {
        res.render("restore-password-mail");
    }

    getRestorePWMailSent = (req, res) => {
        res.render("restore-pw-mail-sent")
    }

    getRestorePassword = async (req, res) => {
        try {
            const { userId } = req.params;
            if (!userId || typeof (userId) !== "string" || userId.length < 5) {
                throw Error("El userId ingresado es incorrecto");
            }
            const restorePasswordRequest = await RestorePasswordRequestService.getRestorePasswordRequest(userId)
            if (restorePasswordRequest && restorePasswordRequest.expiresAt > Date.now()) {
                return res.render("restore-password", { userId: userId });
            } else {
                res.render("restore-password-expired")
            }
        } catch (error) {
            Logger.error("🚀 ~ file: session.routes.js:115 createRestorePasswordRequest ~ error:", error);
        }
    }

    getPasswordRestored = async (req, res) => {
        try {
            return res.render('password-restored')
        } catch (error) {
            Logger.error("🚀 ~ file: session.routes.js:115 createRestorePasswordRequest ~ error:", error);
        }
    }
}

module.exports = ViewsController;