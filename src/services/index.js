const cartService = require('./cart.service');
const userService = require('./user.service');
const productsService = require('./products.service');
const ticketService = require('./ticket.service');
const { ProductManager, CartManager, UserManager, TicketManager } = require('../dao');

const CartService = new cartService(new CartManager());
const ProductsService = new productsService(new ProductManager());
const UserService = new userService(new UserManager());
const TicketService = new ticketService(new TicketManager());

module.exports = {
    CartService,
    ProductsService,
    UserService,
    TicketService
}