const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const passport = require("passport");
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");
const SessionController = require('../controllers/session.controller')
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
class SessionRoutes {
  path = `/api/${API_VERSION}/session`;
  router = Router();
  controller = new SessionController();

  constructor() {
      this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.get(`${this.path}/logout`, authMdw, handlePolicies([policies.ADMIN, policies.USER]), this.controller.logout);
    this.router.get(`${this.path}/faillogin`, handlePolicies([policies.PUBLIC]), this.controller.faillogin)
    this.router.get(`${this.path}/current`, authMdw, handlePolicies([policies.ADMIN, policies.USER]), this.controller.current)
    this.router.post(`${this.path}/register`,passport.authenticate('register', {failureRedirect: '/failRegister'}), this.controller.register);
    this.router.get(`${this.path}/failRegister`, handlePolicies([policies.PUBLIC]), this.controller.failRegister);
    this.router.get(`${this.path}/github`,passport.authenticate("github", { scope: ["user:email"] }), handlePolicies([policies.PUBLIC]), async (req, res) => {});
    this.router.post(`${this.path}/login`,passport.authenticate('login',{failureRedirect:'faillogin'}), handlePolicies([policies.PUBLIC]), this.controller.login);
    this.router.get(`${this.path}/github/callback`,passport.authenticate("github", { failureRedirect: "/login" }), handlePolicies([policies.PUBLIC]),this.controller.githubCallback);
    this.router.post(`${this.path}/restorePassword`, handlePolicies([policies.PUBLIC]), this.controller.restorePassword);
  }
}

module.exports = SessionRoutes;
