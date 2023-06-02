const { Router } = require("express");
const ProductsController = require('../controllers/products.controller')
const { API_VERSION } = require('../config/config');
const authMdw = require("../middleware/auth.middleware");
const handlePolicies = require("../middleware/handlePolicies.middleware");
const { policies } = require('../middleware/constants');
class ProductRoutes {
    path = `/api/${API_VERSION}/products`;
    router = Router();
    controller = new ProductsController();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {
        this.router.param(`pid`, this.controller.validatePIDParam)
        this.router.get(`${this.path}`,authMdw, this.controller.validateGetProductsQueryParams, handlePolicies([policies.ADMIN]), this.controller.getProducts);
        this.router.post(`${this.path}`,authMdw, this.controller.validateBodyForAddProduct, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.addProduct);
        //this.router.get(`${this.path}/insertion`,authMdw,handlePolicies([policies.ADMIN]), this.controller.insertion);
        this.router.delete(`${this.path}/:pid`,authMdw, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.deleteProduct);
        this.router.put(`${this.path}/:pid`,authMdw, this.controller.validateNewPropsForUpdateProducts, handlePolicies([policies.ADMIN, policies.PREMIUM]), this.controller.updateProduct);
    }
}

module.exports = ProductRoutes;
