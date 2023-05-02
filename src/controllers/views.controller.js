
const messagesModel = require("../dao/models/messages.model");
const ProductManager = require("../dao/managers/product-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const UserManager = require("../dao/managers/user-manager-db");

const { ProductsService, CartService, UserService } = require('../services')

class ViewsController {
    productManager = new ProductManager();
    cartManager = new CartManager();
    userManager = new UserManager();

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
        const findUser = await this.userManager.getUser(session.user.email);
        const products = await this.cartManager.getProductsByCartId(cid)
        const mappedProducts = products.map((prod) => {
            return {
                productId: prod.product.productId,
                title: prod.product.title,
                description: prod.product.description,
                code: prod.product.code,
                stock: prod.product.stock,
                category: prod.product.category,
                status: prod.product.status,
                price: prod.product.price,
                id: prod.product._id,
                quantity: prod.quantity
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
        const findUser = await this.userManager.getUser(session.user.email);
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

    getRealTimeProducts = async (_, res) => {
        try {
            const products = await ProductsService.getProducts();
            if (products && products.docs) {
                console.log(products)
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

    getLogin = async (_, res) => {
        try {
            return res.render('login');
        } catch (error) {
            console.log("Error al ingresar al login")
        }
    };

    getRegister = async (req, res) => {
        res.render("register");
    };

    getFailLogin = async (req, res) => {
        res.render("fail-login");
    };

}

module.exports = ViewsController;