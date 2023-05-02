const cartService = require('./cart.service');
const userService = require('./user.service');
const productsService = require('./products.service');
const { ProductManager, CartManager, UserManager } = require('../dao');

const CartService = new cartService(new CartManager());
const ProductsService = new productsService(new ProductManager());
const UserService = new userService(new UserManager());

module.exports = {
    CartService,
    ProductsService,
    UserService
}