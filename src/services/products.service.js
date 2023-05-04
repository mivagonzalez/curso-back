module.exports = class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  addProduct = async ({ title, description, code, price, status, stock, category, thumbnails }) => {
    try {
      const product = await this.dao.addProduct(title, description, price, thumbnails, code, stock, status, category);
      return product;
    } catch (error) {
        console.log('Error adding product', 'Error:', error)
        return null;
    }
  };

  getProducts = async (limit, page, sort, queryObject) => {
    try {
      const products = await this.dao.getProducts(limit, page, sort, queryObject);
      return products;
    } catch (error) {
        console.log('Error getting products' ,'Error:', error)
        return null;
    }
  };

  deleteProduct = async (pid) => {
    try {
      const deletedProducts = await this.dao.deleteProduct(pid);
      return deletedProducts;
    } catch (error) {
        console.log('Error deleting product','Error: ', error)
        return null;
    }
  };

  updateProduct = async (pid, newProps) => {
    try {
      const productUpdated = await this.dao.updateProduct(pid, newProps);
      return productUpdated;
    } catch (error) {
        console.log('Error updating product',pid,'with new props',JSON.stringify(newProps),'Error:', error)
        return null;
    }
  };
  
  insertion = async (productData) => {
    try {
      let result = await this.dao.insertMany(productData);
      return result;
    } catch (error) {
        console.log('Error inserting many products',JSON.stringify(productData),'Error:', error)
        return null;
    }
  };
  
}