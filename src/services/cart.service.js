const { Logger } = require('../helpers')

module.exports = class CartService {
  constructor(dao) {
    this.dao = dao;
  }

  getProductsByCart = async id => {
    try {
      const products = await this.dao.getProductsByCartId(id);
      return products;
    } catch (error) {
        Logger.error('Error getting products for cart', id, 'Error:', error)
        return null;
    }
  };

  createCart = async () => {
    try {
        const cart = await this.dao.addCart()
        return cart;
    } catch (error) {
        Logger.error('Error creating cart' ,'Error:', error)
        return null;
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
        const cartUpdate = await this.dao.addProductToCart(cid, pid);
        return cartUpdate;
    } catch (error) {
        Logger.error('Error adding product',pid,'to cart', cid,'Error:', error)
        return null;
    }
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
        const cartUpdate = await this.dao.updateProductQuantityForCart(cid, pid, quantity);
        return cartUpdate;
    } catch (error) {
        Logger.error('Error updating quantity',quantity,'for product',pid,'to cart', cid,'Error:', error)
        return null;
    }
  };
  
  deleteProductFromCart = async (cid, pid) => {
    try {
        return await this.dao.deleteProductFromCart(cid, pid);
    } catch (error) {
        Logger.error('Error deleting product',pid,'from cart', cid,'Error:', error)
        return null;
    }
  };

  deleteAllProductUnitsFromCart = async (cartId, productId) => {
    try {
        return await this.dao.deleteAllProductUnitsFromCart(cartId, productId);
    } catch (error) {
        Logger.error('Error deleteAllProductUnits',pid,'from FromCart' ,cartId,'Error:', error)
        return null;
    }
  };

  deleteProductFromAllCarts = async (productId) => {
    try {
        return await this.dao.deleteProductFromAllCarts(productId);
    } catch (error) {
        Logger.error('Error deleting product',pid,'from all carts','Error:', error)
        return null;
    }
  };
  
  deleteAllProductsFromCart = async cid => {
    try {
        return await this.dao.deleteAllProductsFromCart(cid);
    } catch (error) {
        Logger.error('Error deleting all products from cart', cid,'Error:', error)
        return null;
    }
  };
  
  updateProductsFromCart = async (cid, newProducts) => {
    try {
        return await this.dao.updateProductsForCart(cid, newProducts);
    } catch (error) {
        Logger.error('Error updating products',newProducts,'for cart', cid,'Error:', error)
        return null;
    }
  };

}
