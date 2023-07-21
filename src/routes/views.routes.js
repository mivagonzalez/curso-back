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
    this.router.get(`${this.path}`, authMdw, handlePolicies([policies.USER,policies.PREMIUM]), this.controller.init)
    this.router.get(`${this.path}ticket/:ticketId`, authMdw, handlePolicies([policies.USER,policies.PREMIUM]), this.controller.getTicket)
    this.router.get(`${this.path}admin`, authMdw, handlePolicies([policies.ADMIN]), this.controller.getUsers)
    this.router.get(`${this.path}admin/user/:uid`, authMdw, handlePolicies([policies.ADMIN]), this.controller.getUser)
    this.router.param('cid', this.controller.validateCIDParam)
    this.router.get(`${this.path}carts/:cid`,authMdw, handlePolicies([policies.USER,policies.PREMIUM, policies.ADMIN]), this.controller.getCart);
    this.router.get(`${this.path}products`, authMdw, handlePolicies([policies.USER,policies.PREMIUM, policies.ADMIN]), this.controller.getProducts);
    this.router.get('/realtimeproducts',authMdw, handlePolicies([policies.USER,policies.PREMIUM]), this.controller.getRealTimeProducts);
    this.router.get('/chat',authMdw, handlePolicies([policies.USER,policies.PREMIUM]),this.controller.getChat);
    this.router.get('/login', handlePolicies([policies.PUBLIC]), this.controller.getLogin);
    this.router.get("/register", handlePolicies([policies.PUBLIC]), this.controller.getRegister);
    this.router.get("/faillogin", handlePolicies([policies.PUBLIC]), this.controller.getFailLogin);
    this.router.get("/restorePasswordRequest", handlePolicies([policies.PUBLIC]), this.controller.getRestorePasswordMail);
    this.router.get("/restorePasswordMailSent", handlePolicies([policies.PUBLIC]), this.controller.getRestorePWMailSent);
    this.router.get(`${this.path}restorePassword/:userId`, handlePolicies([policies.PUBLIC]), this.controller.getRestorePassword);
    this.router.get(`${this.path}passwordRestored`, handlePolicies([policies.PUBLIC]), this.controller.getPasswordRestored);
  }
}

module.exports = ViewsRoutes;
