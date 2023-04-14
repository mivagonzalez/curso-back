const { Router } = require("express");
const CartManager = require("../dao/managers/cart-manager-db");
const { API_VERSION } = require('../config/config');

class CartsRoute {
  path = `/api/${API_VERSION}/carts`;
  router = Router();
  cartManager = new CartManager();

  constructor() {
    this.initCoursesRoutes();
  }

  initCoursesRoutes() {

    this.router.param("cid", async (_, res, next, cid) => {
      console.log("entro aca", cid, Number.isInteger(cid))
      if(!cid || typeof(cid) != 'string' || Number.isInteger(cid)){
          return res.status(400).json({
            message: `id type is not correct`,
            products: null,
          });
        }
      next();
    });

    this.router.get(`${this.path}/:cid`, async (req, res) => {
      try {
        const id = req.params.cid;
        const products = await this.cartManager.getProductsByCartId(id);
        if(products !== null) {
          return res.json({
            message: `cart found successfully`,
            products: products,
          });
        }
        return res.status(400).json({
          message: `cart not found`,
          products: null,
        });
        
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get ~ error:",
          error
        );
      }
    });

    this.router.post(`${this.path}`, async (req, res) => {
      try {
        const cart = await this.cartManager.addCart() ?? null;
        if (!cart) {
          return res.status(400).json({
            message: `Couldn't create the Cart`,
            cart: null
          });
        }

        return res.json({
          message: `Cart created succesfully`,
          course: cart,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post ~ error:",
          error
        );
      }
    });
    
    this.router.param("pid", async (_, res, next, pid) => {
      console.log("entro aca 2", pid, Number.isInteger(pid))
      if(!pid || typeof(pid) != 'string'){
        return res.status(400).json({
          message: `id type is not correct for pid`,
          products: null,
        });
      }
      next();
    });

    this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const { cid, pid } = req.params;

        const updateDoc = await this.cartManager.addProductToCart(cid, pid);
        if(updateDoc && updateDoc.modifiedCount > 0){
          const products = await this.cartManager.getProductsByCartId(cid)
          return res.status(200).json({
            message: `Cart updated Successfully`,
            products: products,
          });
        }
        
        return res.status(400).json({
          message: `Product not added. Cart or Product not found`,
          products: null,
          ok:false
        });
        
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
          error
        );
      }
    });


    this.router.put(`${this.path}/:cid/products/:pid`, async (req, res) => {
      try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        if(!quantity || isNaN(quantity)){
          return res.status(400).json({
            message: `quantity type is not correct or is empty`,
            products: null,
          });
        }
        await this.cartManager.updateProductQuantityForCart(cid, pid, quantity);
        const products = await this.cartManager.getProductsByCartId(cid);
        return res.status(200).json({
          message: `Quantity updated Successfully`,
          products: products,
        });
        
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
          error
        );
      }
    });
    
    this.router.delete(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const { cid, pid } = req.params;
        await this.cartManager.deleteProductFromCart(cid, pid);
        const products = await this.cartManager.getProductsByCartId(cid);
        return res.status(400).json({
          message: `product deleted Successfully`,
          payload: products,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
          error
        );
      }
    });
  
    this.router.delete(`${this.path}/:cid`, async (req, res) => {
      try {
        const { cid } = req.params;
        await this.cartManager.deleteAllProductsFromCart(cid);
        const products = await this.cartManager.getProductsByCartId(cid);        
        return res.status(200).json({
          message: `products deleted Successfully`,
          payload: products,
        });
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
          error
        );
      }
    });

    this.router.put(`${this.path}/:cid`, async (req, res) => {
      try {
        const { cid } = req.params;
        const newProducts = req.body;
        if(!newProducts){
          return res.status(400).json({
            message: `array not passed`,
            payload: null,
          });
        }
        if(newProducts.length < 1){
          return res.status(400).json({
            message: `array is empty`,
            payload: null,
          });
        }
        for (const product of newProducts) {
          if(!product.productId || !product.quantity || typeof(product.productId) !== 'string' || isNaN(product.quantity)){
            return res.status(400).json({
              message: `Products don't have the required format: [{_id: ...(oid) , productId: ...(string) , quantity: ...(int) }]`,
              payload: null,
            });
          }
        }
        await this.cartManager.updateProductsForCart(cid, newProducts);

        const products = await this.cartManager.getProductsByCartId(cid);

        return res.status(200).json({
          message: `products updated Successfully`,
          payload: products,
        });
        
      } catch (error) {
        console.log(
          "🚀 ~ file: cart.routes.js:43 ~ CartsRoutes ~ this.router.post.cid.product.pid ~ error:",
          error
        );
      }
    });
    
  }
}

module.exports = CartsRoute;
