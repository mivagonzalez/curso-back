const { Router } = require("express");
const authMdw = require("../middleware/auth.middleware");
const ViewsController = require('../controllers/views.controller')
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');

class ViewsRoutes {
  path = "/";
  router = Router();
  controller = new ViewsController();


  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.param('cid', this.controller.validateCIDParam)
    this.router.get(`${this.path}carts/:cid`,authMdw, handlePolicies([policies.USER, policies.ADMIN]), this.controller.getCart);
    this.router.get(`${this.path}products`, authMdw, handlePolicies([policies.USER, policies.ADMIN]), this.controller.getProducts);
    this.router.get('/realtimeproducts',authMdw, handlePolicies([policies.USER]), this.controller.getRealTimeProducts);
    this.router.get('/chat',authMdw, handlePolicies([policies.USER]),this.controller.getChat);
    this.router.get('/login', handlePolicies([policies.PUBLIC]), this.controller.getLogin);
    this.router.get("/register", handlePolicies([policies.PUBLIC]), this.controller.getRegister);
    this.router.get("/faillogin", handlePolicies([policies.PUBLIC]), this.controller.getFailLogin);
  }
}

module.exports = ViewsRoutes;
