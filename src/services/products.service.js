module.exports = class ProductService {
  constructor(dao) {
    this.dao = dao;
  }

  addProduct = async (productDTO) => {
    try {
      const product = await this.dao.addProduct(productDTO);
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

  getProductById = async (id) => {
    try {
      const product = await this.dao.getProductById(id);
      return product;
    } catch (error) {
        console.log('Error getting product with id', id ,'Error:', error)
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
    console.log(newProps, 'NEW PROPSSS----------')
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
