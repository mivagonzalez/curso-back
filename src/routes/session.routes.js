const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const UserManager = require("../dao/managers/user-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const {createHash, isValidPassword } = require('../utils');
const passport = require("passport");

class SessionRoutes {
  path = "/api/v1/session";
  router = Router();
  productManager = new ProductManager()
  cartManager = new CartManager();
  userManager = new UserManager();

  constructor() {
      this.initCoursesRoutes();
  }

  initCoursesRoutes() {
    this.router.get(`${this.path}/logout`, async (req, res) => {
      req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({ message: `logout Error`, body: err });
      });
    });
    this.router.get(`${this.path}/faillogin`, (req, res) => {
      console.log("invalid credentials");
      res.redirect('/login')
    })
    this.router.post(`${this.path}/login`,passport.authenticate('login',{failureRedirect:'faillogin'}), async (req, res) => {
      try {
        if(!req.user) {
          console.log(req);
          return res.status(400).send({status: "error", error: "invalid credentials"});
        }
        delete req.user.password
        req.session.user = {
          ...req.user
        }
              
      const {
        docs: products,
        limit: limitPag,
        totalPages,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage,
        page: currentPage
      } = await this.productManager.getProducts(10,1,null,null);
      
      const mappedProducts = products.map((prod) => {
        return {
          id: prod.productId,
          title: prod.title,
          description: prod.description,
          code: prod.code,
          stock: prod.stock,
          category: prod.category,
          status: prod.status,
          price: prod.price,
          thumbnails: prod.thumbnails
        };
      });
      const findUser = await this.userManager.getUser(req.user.email)

      if(!findUser) {
        return res.json({ message: `invalid credentials` });
      }

      console.log(findUser)

      let total_cart_products = 0;
      findUser.cart.products.forEach(product => {
        total_cart_products += product.quantity
      }); 
      let data = {
        style: 'index',
        cartId: req.session?.user?._doc?.cart?.cartId || findUser.cart?.cartId,
        products: mappedProducts,
        currentPage:currentPage,
        firstPage: 1,
        lastPage: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: `/products?page=${nextPage}`,
        prevPage: `/products?page=${prevPage}`,
        lastPage: `/products?page=${totalPages}`,
        firstPage: `/products?page=${1}`,
        isNotInLastPage: currentPage !== totalPages,
        isNotInFirstPage: currentPage !== 1,
        first_name: req.session?.user?._doc?.first_name || findUser.first_name,
        last_name: req.session?.user?._doc?.last_name || findUser.last_name,
        email: req.session?.user?._doc?.email || email,
        age: req.session?.user?._doc?.age || findUser.age,
        total_cart_products: total_cart_products,
        role: req.session?.user._doc.role || findUser.role
      }    
        return res.render('products', data);
      } catch (error) {
        console.log(
          "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
          error
        );
      }
    });
    
    this.router.post(`${this.path}/register`,passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
      res.redirect('/login')
    });

    this.router.get(`${this.path}/failRegister`, async (req, res) => {
      console.log("failed Strategy")
      res.redirect('/register')
    });
  }
}

module.exports = SessionRoutes;
