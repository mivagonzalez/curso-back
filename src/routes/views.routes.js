const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const UserManager = require("../dao/managers/user-manager-db");
const authMdw = require("../middleware/auth.middleware");
const ViewsController = require('../controllers/views.controller')

class ViewsRoutes {
  path = "/";
  router = Router();
  productManager = new ProductManager();
  cartManager = new CartManager();
  cartManager = new CartManager();
  userManager = new UserManager();
  controller = new ViewsController();


  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.param('cid', this.controller.validateCIDParam)
    this.router.get(`${this.path}carts/:cid`,authMdw, this.controller.getCart);
    this.router.get(`${this.path}products`, authMdw, this.controller.getProducts);
    this.router.get('/realtimeproducts',authMdw, this.controller.getRealTimeProducts);
    this.router.get('/chat',authMdw ,this.controller.getChat);
    this.router.get('/login', this.controller.getLogin);
    this.router.get("/register", this.controller.getRegister);
    this.router.get("/faillogin", this.controller.getFailLogin);
  }
}

module.exports = ViewsRoutes;
