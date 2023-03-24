const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const UserManager = require("../dao/managers/user-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");

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
    
    this.router.post(`${this.path}/login`, async (req, res) => {
      try {
        const { email, password } = req.body;
        const session = req.session;
        console.log(
          "🚀 ~ file: session.routes.js:17 ~ router.post ~ session:",
          session
        );
    
        const findUser = await this.userManager.getUser(email);
        console.log('++++++++++++++findUser', findUser)
        console.log(
          "🚀 ~ file: session.routes.js:18 ~ router.post ~ findUser:",
          findUser
        );
    
        if (!findUser) {
          return res.json({ message: `este usuario no esta registrado` });
        }
    
        if (findUser.password !== password) {
          return res.json({ message: `password incorrecto` });
        }
    
        req.session.user = {
          ...findUser,
        };
        
        const { page: reqPage } = req.query;
      let page;
      if(!reqPage || isNaN(reqPage)) {
        page = 1;
      }else{
        page = Number(reqPage)
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
      } = await this.productManager.getProducts(10,page,null,null);
      
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
        total_cart_products: total_cart_products
      }    
        return res.render('products', data);
      } catch (error) {
        console.log(
          "🚀 ~ file: session.routes.js:23 ~ router.post ~ error:",
          error
        );
      }
    });
    
    this.router.post(`${this.path}/register`, async (req, res) => {
      try {
        console.log("BODY ****", req.body);
        const { first_name, last_name, email, age, password, address } = req.body;
        const newCart = await this.cartManager.addCart();
        if(!newCart){
          return res.json({ message: `No se pudo crear el carrito de compras para este usuario` });
        }
        const userAdd = { email, password, first_name, last_name, age, address, cart: newCart._id };
        const newUser = await this.userManager.addUser(userAdd);
        console.log(
          "🚀 ~ file: session.routes.js:61 ~ router.post ~ newUser:",
          newUser
        );
    
        req.session.user = { email, first_name, last_name, age, address, cartId: newCart.cartId };
        return res.render(`login`);
      } catch (error) {
        console.log(
          "🚀 ~ file: session.routes.js:36 ~ router.post ~ error:",
          error
        );
      }
    });
  }
}

module.exports = SessionRoutes;
