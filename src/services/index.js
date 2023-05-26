const cartService = require('./cart.service');
const userService = require('./user.service');
const productsService = require('./products.service');
const ticketService = require('./ticket.service');
const restorePasswordRequestService = require('./restorePasswordRequest.service');
const { ProductManager, CartManager, UserManager, TicketManager, RestorePaswordRequestManager } = require('../dao');

const CartService = new cartService(new CartManager());
const ProductsService = new productsService(new ProductManager());
const UserService = new userService(new UserManager());
const TicketService = new ticketService(new TicketManager());
const RestorePasswordRequestService = new restorePasswordRequestService(new RestorePaswordRequestManager());

module.exports = {
    CartService,
    ProductsService,
    UserService,
    TicketService,
    RestorePasswordRequestService
}