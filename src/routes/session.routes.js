const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const passport = require("passport");
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");
const SessionController = require('../controllers/session.controller')

class SessionRoutes {
  path = `/api/${API_VERSION}/session`;
  router = Router();
  productManager = new ProductManager()
  controller = new SessionController();

  constructor() {
      this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.get(`${this.path}/logout`,authMdw, this.controller.logout);

    this.router.get(`${this.path}/faillogin`, this.controller.faillogin)

    this.router.get(`${this.path}/current`,authMdw, this.controller.current)
  
    this.router.post(`${this.path}/register`,passport.authenticate('register', {failureRedirect: '/failRegister'}), this.controller.register);

    this.router.get(`${this.path}/failRegister`, this.controller.failRegister);
    
    this.router.get(
      `${this.path}/github`,
      passport.authenticate("github", { scope: ["user:email"] }),
      );
      

      this.router.post(`${this.path}/login`,passport.authenticate('login',{failureRedirect:'faillogin'}), this.controller.login);
      
    this.router.get(
      `${this.path}/github/callback`,
      passport.authenticate("github", { failureRedirect: "/login" }),
      this.controller.githubCallback
    );
  }
}

module.exports = SessionRoutes;
