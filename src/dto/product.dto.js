const { v4: uuidv4 } = require('uuid');

class ProductDTO {
    constructor(product){
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.price = product.price;
        this.status = product.status;
        this.stock = product.stock;
        this.category = product.category;
        this.thumbnails = Array.isArray(product.thumbnails) ? product.thumbnails : [product.thumbnails];
        this.productId = uuidv4();
    }
}

module.exports = ProductDTO