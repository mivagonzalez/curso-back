const { Router } = require("express");
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");
const UserController = require('../controllers/user.controller')
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
const { uploader } = require('../utils')

class UserRoutes {
  path = `/api/${API_VERSION}/user`;
  router = Router();
  controller = new UserController();

  constructor() {
      this.initUserRoutes();
  }

  initUserRoutes() {
    this.router.delete(`${this.path}/:uid`, authMdw, handlePolicies([policies.ADMIN]), this.controller.deleteUser)
    this.router.delete(this.path, authMdw, handlePolicies([policies.ADMIN]), this.controller.deleteInactiveusers)
    this.router.get(this.path, authMdw, handlePolicies([policies.ADMIN]), this.controller.getAllUsers)
    this.router.get(`${this.path}/current`, authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM, policies.USER]), this.controller.current)
    this.router.get(`${this.path}/premium/:uid`, authMdw, handlePolicies([policies.ADMIN]), this.controller.updateRole)
    this.router.post(`${this.path}/:uid/documents`, authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM, policies.USER]), uploader.fields([{ name: 'profile', maxCount: 1 }, { name: 'product', maxCount: 1 }, { name: 'documents', maxCount: 10 }]), this.controller.uploadDocuments)

  }
}

module.exports = UserRoutes;
