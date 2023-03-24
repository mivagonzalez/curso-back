const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const UserManager = require("../dao/managers/user-manager-db");
const messagesModel = require("../dao/models/messages.model");
const userModel = require("../dao/models/user.model");
const authMdw = require("../middleware/auth.middleware");

class ViewsRoutes {
  path = "/";
  router = Router();
  productManager = new ProductManager();
  cartManager = new CartManager();
  cartManager = new CartManager();
  userManager = new UserManager();


  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}carts/:cid`,authMdw, async (req, res) => {
      const { cid } = req.params;
      if(!cid || !isNaN(cid) || cid.length < 1) {
        console.log('error, invalid cid')
        return res.render('products', {products: []});
      }
      const session = req.session;
      const findUser = await this.userManager.getUser(session.user._doc.email);
      const products = await this.cartManager.getProductsByCartId(cid)
      const mappedProducts = products.map((prod) => {
        return {
          productId: prod.product.productId,
          title: prod.product.title,
          description: prod.product.description,
          code: prod.product.code,
          stock: prod.product.stock,
          category: prod.product.category,
          status: prod.product.status,
          price: prod.product.price,
          id: prod.product._id,
          quantity:prod.quantity
        };
      });
      let cart = {
        style: 'index',
        products:mappedProducts,
        first_name: req.session?.user?._doc?.first_name || findUser.first_name,
        last_name: req.session?.user?._doc?.last_name || findUser.last_name,
        email: req.session?.user?._doc?.email || email,
      }

      return res.render('cart', cart);
    });


    this.router.get(`${this.path}products`, authMdw, async (req, res) => {
      const { page: reqPage } = req.query;
      const session = req.session;
      const findUser = await this.userManager.getUser(session.user._doc.email);
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

      let total_cart_products = 0;

      findUser.cart.products.forEach(product => {
        total_cart_products += product.quantity
      });
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
      let testProduct = {
        style: 'index',
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
        cartId: req.session?.user?._doc?.cart?.cartId || findUser.cart.cartId,
        total_cart_products: total_cart_products
      }
      console.log(req.session.user._doc.cart.car,'++++++')
      return res.render('products', testProduct);
    });


    this.router.get('/realtimeproducts',authMdw, async (_, res) => {
      const products = await this.productManager.getProducts()
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
      let testProduct = {
        style: 'index',
        products: mappedProducts
      }
      return res.render('real-time-products', testProduct);
    });

    this.router.get('/chat',authMdw ,async (_, res) => {
      try {
        const messages = await messagesModel.find({});
        const mappedMessages = messages.map((message) => {
          return {
            user: message.user,
            message: message.message
          };
        });
        return res.render('chat', { style: 'chat' });
      } catch (error) {
        console.log("Error al intentar obtener los mensajes")
        return res.json({
          ok: false,
          message: "Error al intentar obtener los mensajes"
        });
      }
    });
    
    this.router.get('/login', async (_, res) => {
      try {
        return res.render('login');
      } catch (error) {
        console.log("Error al ingresar al login")
      }
    });

    this.router.get("/register", async (req, res) => {
      res.render("register");
    });


  }
}

module.exports = ViewsRoutes;
