const { Router } = require("express");
const ProductsController = require('../controllers/products.controller')
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");

class ProductRoutes {
    path = `/api/${API_VERSION}/products`;
    router = Router();
    controller = new ProductsController();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {
        this.router.param(`pid`, this.controller.validatePIDParam)
        this.router.post(`${this.path}`,authMdw, this.controller.validateBodyForAddProduct, this.controller.addProduct);
        this.router.get(`${this.path}`,authMdw, this.controller.validateGetProductsQueryParams, this.controller.getProducts);
        this.router.get(`${this.path}/insertion`, this.controller.insertion);
        this.router.delete(`${this.path}/:pid`,authMdw, this.controller.deleteProduct);
        this.router.put(`${this.path}/:pid`,authMdw, this.controller.validateNewPropsForUpdateProducts, this.controller.updateProduct);
    }
}

module.exports = ProductRoutes;
