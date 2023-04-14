const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const UserManager = require("../dao/managers/user-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const passport = require("passport");
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");


class SessionRoutes {
  path = `/api/${API_VERSION}/session`;
  router = Router();
  productManager = new ProductManager()
  cartManager = new CartManager();
  userManager = new UserManager();

  constructor() {
      this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.get(`${this.path}/logout`,authMdw, async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({ message: `logout Error`, body: err });
      });
    });
    this.router.get(`${this.path}/faillogin`, (req, res) => {
      console.log("invalid credentials");
      res.redirect('/faillogin')
    })
    
    this.router.get(`${this.path}/current`,authMdw, async (req, res) => {
      if(!req.user) {
        console.log(req);
        return res.status(400).send({status: "error", error: "You need to be logged in to see this"});
      }
      const user = await this.userManager.getUser(req.user.email);
      if(user) {
        return res.status(200).json({
          message: `User Found successfully`,
          user: user,
        });
      }
      return res.status(400).json({
        error: `User not found successfully`,
        user: null,
      });
    })
  
    
    this.router.post(`${this.path}/register`,passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
      res.redirect('/login')
    });

    this.router.get(`${this.path}/failRegister`, async (req, res) => {
      console.log("failed Strategy")
      res.redirect('/register')
    });
    
    this.router.get(
      `${this.path}/github`,
      passport.authenticate("github", { scope: ["user:email"] }),
      async (req, res) => {}
      );
      

      this.router.post(`${this.path}/login`,passport.authenticate('login',{failureRedirect:'faillogin'}), async (req, res) => {
        try {
          if(!req.user) {
            console.log(req);
            return res.status(400).send({status: "error", error: "invalid credentials"});
          }
          delete req.user.password
          req.session.user = req.user;     
          return res.redirect('/products');
        } catch (error) {
          console.log(
            "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
            error
          );
        }
      });
      
    this.router.get(
      `${this.path}/github/callback`,
      passport.authenticate("github", { failureRedirect: "/login" }),
      async (req, res) => {
        try {
          delete req.user.password;
          req.session.user = req.user;
          res.redirect("/products");
        } catch (error) {
          console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
        }
      }
    );
  }
}

module.exports = SessionRoutes;
