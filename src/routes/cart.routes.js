const { Router } = require("express");
const CartManager = require("../dao/managers/cart-manager-db");
const { API_VERSION } = require('../config/config');
const CartController = require('../controllers/cart.controller')

class CartsRoute {
  path = `/api/${API_VERSION}/carts`;
  router = Router();
  cartManager = new CartManager();
  controller = new CartController()

  constructor() {
    this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.param("cid", this.controller.validateCIDParam);
    this.router.get(`${this.path}/:cid`, this.controller.getProductsByCart);
    this.router.post(`${this.path}`, this.controller.createCart);
    this.router.param("pid", this.controller.validatePIDParam);
    this.router.post(`${this.path}/:cid/product/:pid`, this.controller.addProductToCart);
    this.router.put(`${this.path}/:cid/products/:pid`, this.controller.updateProductQuantity);
    this.router.delete(`${this.path}/:cid/product/:pid`, this.controller.deleteProductFromCart);
    this.router.delete(`${this.path}/:cid`, this.controller.deleteAllproductsFromCart);
    this.router.put(`${this.path}/:cid`, this.controller.updateproductsFromCart);
  }
}

module.exports = CartsRoute;
