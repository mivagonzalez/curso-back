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
    this.router.get(`${this.path}`, async (_, res) => {
      const products = await this.productManager.getProducts();
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
