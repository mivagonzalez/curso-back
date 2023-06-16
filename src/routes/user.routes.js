const { Router } = require("express");
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");
const UserController = require('../controllers/user.controller')
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');

class UserRoutes {
  path = `/api/${API_VERSION}/user`;
  router = Router();
  controller = new UserController();

  constructor() {
      this.initUserRoutes();
  }

  initUserRoutes() {
    this.router.get(`${this.path}/current`, authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM, policies.USER]), this.controller.current)
    this.router.get(`${this.path}/premium/:uid`, authMdw, handlePolicies([policies.ADMIN]), this.controller.updateRole)
  }
}

module.exports = UserRoutes;
