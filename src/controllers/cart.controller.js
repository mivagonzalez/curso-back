
const { CartService } = require('../services')
const { ProductsService } = require('../services');
const ProductService = require('../services/products.service');
const TicketService = require('../services/ticket.service');
const moment = require('moment')
const TicketDTO = require('../dto')
class CartController {

    validatePIDParam = async (_, res, next, pid) => {
        if (!pid || typeof (pid) != 'string') {
            return res.status(400).json({
                message: `id type is not correct for pid`,
                products: null,
            });
        }
        next();
    };

    validateCIDParam = async (_, res, next, cid) => {
        if (!cid || typeof (cid) != 'string' || Number.isInteger(cid)) {
            return res.status(400).json({
                message: `id type is not correct`,
                products: null,
            });
        }
        next();
    };

    getProductsByCart = async (req, res) => {
        try {
            const id = req.params.cid;
            const products = await CartService.getProductsByCart(id);
            if (products) {
                return res.json({
                    message: `cart found successfully`,
                    products: products,
                });
            }
            return res.status(400).json({
                message: `products not found for cart ${id}`,
                products: null,
            });

        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get ~ error:",
                error
            );
        }
    };

    createCart = async (req, res) => {
        try {
            const cart = await CartService.createCart() ?? null;
            if (!cart) {
                return res.status(400).json({
                    message: `Couldn't create the Cart`,
                    cart: null
                });
            }

            return res.json({
                message: `Cart created succesfully`,
                course: cart,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post ~ error:",
                error
            );
        }
    };

    addProductToCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;

            const updateDoc = await CartService.addProductToCart(cid, pid);
            if (updateDoc && updateDoc.modifiedCount > 0) {
                const products = await CartService.getProductsByCart(cid);
                return res.status(200).json({
                    message: `Cart updated Successfully`,
                    products: products,
                });
            }

            return res.status(400).json({
                message: `Product not added. Cart or Product not found`,
                products: null,
                ok: false
            });

        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
        }
    };

    validateQuantity = async (req, res, next) => {
        const { quantity } = req.body;
        if (!quantity || isNaN(quantity)) {
            return res.status(400).json({
                message: `quantity type is not correct or is empty`,
                products: null,
            });
        }
        next();
    };

    deleteProductFromAllCarts = async (req, res) => {
        try {
            const { pid } = req.params;
            const deleted = await CartService.deleteProductFromAllCarts(pid);
            return res.status(200).json({
                message: `prod deleted Successfully`,
                deleted: deleted,
            });

        } catch (error) {
            console.log(
                "🚀 Error deleting product from all carts. Controller. Error:",
                error
            );
        }
    };
    
    updateProductQuantity = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            await CartService.updateProductQuantity(cid, pid, quantity);
            const products = await CartService.getProductsByCart(cid);
            return res.status(200).json({
                message: `Quantity updated Successfully`,
                products: products,
            });

        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
        }
    };

    deleteProductFromCart = async (req, res) => {
        try {
            const { cid, pid } = req.params;
            await CartService.deleteProductFromCart(cid, pid);
            const products = await CartService.getProductsByCart(cid);
            return res.status(400).json({
                message: `product deleted Successfully`,
                payload: products,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
        }
    };
    purchaseProducts = async (req, res) => {
        try {
            const { cid } = req.params;
            let totalPrice;
            let unavaliableProducts = [];
            let ticket = null;
            let boughtProducts = []

            const cartProducts = await CartService.getProductsByCart(cid);
            if(!cartProducts) {
                return res.status(400).json({
                    message: `No hay productos asociados al carrito ${cid}`,
                    payload: null,
                });
            }
            console.log('PRODUCTS BY CAR', cartProducts)

            const availiableProducts = cartProducts.map(async prod => {
                const product = ProductsService.getProductById(prod.productId);
                if(product.stock >= prod.quantity){
                    return prod
                } else {
                    unavaliableProducts.push(prod)
                }
            })

            if(availiableProducts) {
                for (let product of availiableProducts) {
                    const productInStock = await ProductService.getProductById(product.productId); 
                    const updated = await ProductService.updateProductQuantity(product.productId, {quantity: productInStock.quantity - product.quantity })
                    if (updated) {
                        totalPrice += (product.quantity * productInStock.price);
                        boughtProducts.push(product)
                    }
                }
                await CartService.updateProductsFromCart(cid, availiableProducts);

                if(boughtProducts && boughtProducts.length > 0){
                    const purchase_datetime = moment().format('MMMM Do YYYY, h:mm:ss a');
                    const purchaser = req.user.email;
                    const ticketDTO = new TicketDTO({purchaser, purchase_datetime, amount: totalPrice})
                    ticket = await TicketService.createTicket(ticketDTO);
                }
            }
            if(ticket) {
                return res.status(200).json({
                    message: `products bought Successfully`,
                    ticket: ticket,
                    notAvailableProducts: unavaliableProducts
                });
            }
            return res.status(400).json({
                message: `products not bought`,
                ticket: null,
                notAvailableProducts: unavaliableProducts
            });
           
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
            return res.status(400).json({
                message: `products not bought`,
                ticket: null,
                notAvailableProducts: null,
                error: error
            });
        }
    }
    deleteAllproductsFromCart = async (req, res) => {
        try {
            const { cid } = req.params;
            await CartService.deleteAllProductsFromCart(cid);
            const products = await CartService.getProductsByCart(cid);
            return res.status(200).json({
                message: `products deleted Successfully`,
                payload: products,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
        }
    };

    validateNewProducts = async (req, res, next) => {
        const newProducts = req.body;
        if (!newProducts) {
            return res.status(400).json({
                message: `array not passed`,
                payload: null,
            });
        }
        if (newProducts.length < 1) {
            return res.status(400).json({
                message: `array is empty`,
                payload: null,
            });
        }
        for (const product of newProducts) {
            if (!product.productId || !product.quantity || typeof (product.productId) !== 'string' || isNaN(product.quantity)) {
                return res.status(400).json({
                    message: `Products don't have the required format: [{_id: ...(oid) , productId: ...(string) , quantity: ...(int) }]`,
                    payload: null,
                });
            }
        }
        next();
    };

    updateProductsFromCart = async (req, res) => {
        try {
            const { cid } = req.params;
            const newProducts = req.body;
            await CartService.updateProductsFromCart(cid, newProducts);
            const products = await CartService.getProductsByCart(cid);
            if(products) {
                return res.status(200).json({
                    message: `products updated Successfully`,
                    payload: products,
                });
            }
            return res.status(400).json({
                message: `No se pudo actualziar los productos`,
                payload: null,
            });
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
                error
            );
        }
    };
}

module.exports = CartController;