module.exports = class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  getProductsByCart = async id => {
    try {
      const products = await this.dao.getProductsByCartId(id);
      return products;
    } catch (error) {
        console.log('Error getting products for cart', id, 'Error:', error)
        return null;
    }
  };

  createCart = async () => {
    try {
        const cart = await this.dao.addCart()
        return cart;
    } catch (error) {
        console.log('Error creating cart' ,'Error:', error)
        return null;
    }
  };

  addProductToCart = async (cid, pid) => {
    try {
        const cartUpdate = await this.dao.addProductToCart(cid, pid);
        return cartUpdate;
    } catch (error) {
        console.log('Error adding product',pid,'to cart', cid,'Error:', error)
        return null;
    }
  };

  updateProductQuantity = async (cid, pid, quantity) => {
    try {
        const cartUpdate = await this.dao.updateProductQuantityForCart(cid, pid, quantity);
        return cartUpdate;
    } catch (error) {
        console.log('Error updating quantity',quantity,'for product',pid,'to cart', cid,'Error:', error)
        return null;
    }
  };
  
  deleteProductFromCart = async (cid, pid) => {
    try {
        return await this.dao.deleteProductFromCart(cid, pid);
    } catch (error) {
        console.log('Error deleting product',pid,'from cart', cid,'Error:', error)
        return null;
    }
  };
  
  deleteAllproductsFromCart = async cid => {
    try {
        return await this.dao.deleteAllProductsFromCart(cid);
    } catch (error) {
        console.log('Error deleting all products from cart', cid,'Error:', error)
        return null;
    }
  };
  
  updateproductsFromCart = async (cid, newProducts) => {
    try {
        return await this.dao.updateProductsForCart(cid, newProducts);
    } catch (error) {
        console.log('Error updating products',newProducts,'for cart', cid,'Error:', error)
        return null;
    }
  };

}
