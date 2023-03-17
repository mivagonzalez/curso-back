const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");
const CartManager = require("../dao/managers/cart-manager-db");
const messagesModel = require("../dao/models/messages.model");
class ViewsRoutes {
  path = "/";
  router = Router();
  productManager = new ProductManager();
  cartManager = new CartManager();


  constructor() {
    this.initViewsRoutes();
  }

  initViewsRoutes() {
    this.router.get(`${this.path}carts/:cid`, async (req, res) => {
      const { cid } = req.params;
      if(!cid || !isNaN(cid) || cid.length < 1) {
        console.log('error, invalid cid')
        return res.render('products', {products: []});
      }

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
          id: prod.product._id
        };
      });
      let testProduct = {
        style: 'index',
        products:mappedProducts
      }

      return res.render('products', testProduct);
    });


    this.router.get(`${this.path}products`, async (req, res) => {
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
      let testProduct = {
        style: 'index',
        products: mappedProducts,
        currentPage:currentPage,
        firstPage: 1,
        lastPage: totalPages,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage,
        nextPage: `/?page=${nextPage}`,
        prevPage: `/?page=${prevPage}`,
        lastPage: `/?page=${totalPages}`,
        firstPage: `/?page=${1}`,
        isNotInLastPage: currentPage !== totalPages,
        isNotInFirstPage: currentPage !== 1
      }

      return res.render('products', testProduct);
    });


    this.router.get('/realtimeproducts', async (_, res) => {
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

    this.router.get('/chat', async (_, res) => {
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
  }
}

module.exports = ViewsRoutes;
