
const { TicketService } = require('../services')
const moment = require('moment')
const { TicketDTO } = require('../dto')
class TicketController {

    createTicket = async (req, res) => {
        try {
            const { amount } = req.body;
            if( !amount || Number(amount) <= 0 ) {
                console.log('Ticket can not be created without amount');
                return null;
            }
            const purchase_datetime = moment().format('MMMM Do YYYY, h:mm:ss a');
            const purchaser = req.user.email;
            const ticketDTO = new TicketDTO(purchaser, purchase_datetime, amount)

            const ticket = await TicketService.createTicket(ticketDTO) ?? null;
            if (!ticket) {
                return res.status(400).json({
                    message: `Ticket not created `,
                    ticket: null
                });
            }

            return res.json({
                message: `Ticket created succesfully`,
                ticket: ticket,
            });
        } catch (error) {
            console.log(
                "🚀 Error when creating ticket. Error:",
                error
            );
        }
    };

    getTicket = async (req, res) => {
        try {
            const {email,purchaser,code} = req.query;

            const ticket = await TicketService.getTicket({email: email || null, purchaser: purchaser || null, code: code || null});
            if (ticket) {
                return res.status(200).json({
                    message: `Ticket found Successfully`,
                    ticket: ticket,
                });
            }

            return res.status(400).json({
                message: `Ticket not found.`,
                ticket: null,
                ok: false
            });

        } catch (error) {
            console.log(
                "🚀Error when searching for ticket. Error:",
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

module.exports = TicketController;