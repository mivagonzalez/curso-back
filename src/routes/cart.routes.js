const { Router } = require("express");
const { API_VERSION } = require('../config/config');
const CartController = require('../controllers/cart.controller')
const authMdw = require("../middleware/auth.middleware");

class CartsRoute {
  path = `/api/${API_VERSION}/carts`;
  router = Router();
  controller = new CartController()

  constructor() {
    this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.param("cid", this.controller.validateCIDParam);
    this.router.param("pid", this.controller.validatePIDParam);
    this.router.get(`${this.path}/:cid`, authMdw, this.controller.getProductsByCart);
    this.router.post(`${this.path}`, authMdw, this.controller.createCart);
    this.router.post(`${this.path}/:cid/product/:pid`, authMdw, this.controller.addProductToCart);
    this.router.put(`${this.path}/:cid/products/:pid`, authMdw, this.controller.validateQuantity,this.controller.updateProductQuantity);
    this.router.delete(`${this.path}/:cid/product/:pid`, authMdw, this.controller.deleteProductFromCart);
    this.router.delete(`${this.path}/:cid`, authMdw, this.controller.deleteAllproductsFromCart);
    this.router.put(`${this.path}/:cid`, authMdw,this.controller.validateNewProducts,this.controller.updateProductsFromCart);
  }
}

module.exports = CartsRoute;
