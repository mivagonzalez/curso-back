const CartManager = require("./managers/cart-manager-db");
const ProductManager = require('./managers/product-manager-db');
const UserManager = require('./managers/user-manager-db');
const TicketManager = require('./managers/ticket-manager-db');

module.exports = {
    CartManager,
    ProductManager,
    UserManager,
    TicketManager
}