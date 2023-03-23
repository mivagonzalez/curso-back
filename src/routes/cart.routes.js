const { Router } = require("express");
const CartManager = require("../dao/managers/cart-manager-db");

class CartsRoute {
  path = "/api/v1/carts";
  router = Router();
  cartManager = new CartManager();

  constructor() {
    this.initCoursesRoutes();
  }

  initCoursesRoutes() {

    this.router.get(`${this.path}/:cid`, async (req, res) => {
      try {
        const id = req.params.cid;
        if(!id || typeof(id) != 'string' || Number.isInteger(id)){
          return res.status(400).json({
            message: `id type is not correct`,
            products: null,
          });
        }
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
    
    this.router.post(`${this.path}/:cid/product/:pid`, async (req, res) => {
      try {
        const { cid, pid } = req.params;

        if(!cid || typeof(cid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for cid`,
            products: null,
          });
        }
        else if(!pid || typeof(pid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for pid`,
            products: null,
          });
        }

        await this.cartManager.addProductToCart(cid, pid);

        const products = await this.cartManager.getProductsByCartId(cid)

        
        return res.status(200).json({
          message: `Cart updated Successfully`,
          products: products,
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
        if(!cid || typeof(cid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for cid`,
            products: null,
          });
        }
        if(!quantity || isNaN(quantity)){
          return res.status(400).json({
            message: `quantity type is not correct or is empty`,
            products: null,
          });
        }
        if(!pid || typeof(pid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for pid`,
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

        if(!cid || typeof(cid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for cid`,
            payload: null,
          });
        }
        else if(!pid || typeof(pid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for pid`,
            payload: null,
          });
        }

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

        if(!cid || typeof(cid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for cid`,
            payload: null,
          });
        }

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
        if(!cid || typeof(cid) != 'string'){
          return res.status(400).json({
            message: `id type is not correct for cid`,
            payload: null,
          });
        }
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
