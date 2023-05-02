const { Router } = require("express");
const productsModel = require("../dao/models/products.model");
const productData = require("./mock-data")
const { API_VERSION } = require('../config/config');
const ProductsController = require('../controllers/products.controller')

class ProductRoutes {
    path = `/api/${API_VERSION}/products`;
    router = Router();
    controller = new ProductsController();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {

        this.router.param(`pid`, this.controller.validatePIDParam)

        this.router.post(`${this.path}`, this.controller.validateBodyForAddProduct, async (req, res) => {
            try {
                const { title, description, code, price, status, stock, category, thumbnails } = req.body;
                const product = await this.productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
                if (product) {
                    return res.json({
                        message: `Product created succesfully`,
                        product: product,
                        ok: true
                    });
                }

                return res.json({
                    message: `Product not created5`,
                    product: null,
                    ok: false,
                });
            } catch (error) {
                return res.status(400).json({
                    ok: false,
                    message: `Product Not created6`,
                    product: null,
                    error: error.message
                });
            }
        });

        this.router.get(`${this.path}`, this.controller.validateGetProductsQueryParams,async (req, res) => {
            try {
                const { limit = 10, page = 1, sort, query } = req.query;
                let queryObject = {};
                if (query === 'stock') {
                    queryObject = { stock: { $gt: 0 } }
                }
                else if (query.length > 1 && isNaN(query)) {
                    queryObject = {
                        category: query
                    }
                }
                else {
                    queryObject = {}
                }
                const sortQueryParam = sort && `&sort=${sort}` || '';
                const {
                    docs,
                    limit: limitPag,
                    totalPages,
                    hasPrevPage,
                    hasNextPage,
                    nextPage,
                    prevPage,
                    page: currentPage,
                } = await this.productManager.getProducts(limit, page, sort, queryObject);
                if (docs && docs.length > 0) {
                    return res.json({
                        status: 'success',
                        payload: docs,
                        totalPages: totalPages,
                        prevPage: prevPage,
                        nextPage: nextPage,
                        page: currentPage,
                        hasPrevPage: hasPrevPage,
                        hasNextPage: hasNextPage,
                        prevLink: hasPrevPage && `/api/${API_VERSION}/products?query=${query}&limit=${limit}${sortQueryParam}&page=${prevPage}` || null,
                        nextLink: hasNextPage && `/api/${API_VERSION}/products?query=${query}&limit=${limit}${sortQueryParam}&page=${nextPage}` || null,
                    });
                }
                return res.status(400).json({
                    status: 'error',
                    payload: null,
                    totalPages: totalPages,
                    prevPage: null,
                    nextPage: null,
                    page: currentPage,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevLink: null,
                    nextLink: null,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get ~ error:",
                    error
                );
            }
        });

        this.router.get(`${this.path}/insertion`, async (req, res) => {
            try {
                let result = await productsModel.insertMany(productData);
                return res.json({
                    message: "all the products are inserted succesfully",
                    students: result,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: products.routes.js:15 ~ router.get.insertion ~ error:",
                    error
                );
            }
        });

        this.router.delete(`${this.path}/:pid`, async (req, res) => {
            try {
                const { pid } = req.params;
                const deletedProducts = await this.productManager.deleteProduct(pid);
                if (deletedProducts && deletedProducts.deletedCount > 0) {
                    return res.json({
                        ok: true,
                        message: `Product deleted`,
                    });
                }
                return res.status(500).json({
                    ok: false,
                    message: `product not deleted`,
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.delete ~ error:",
                    error
                );
            }
        });

        this.router.put(`${this.path}/:pid`, this.controller.validateNewPropsForUpdateProducts, async (req, res) => {
            try {
                const { pid } = req.params;
                const newProps = req.body;
                const productUpdated = await this.productManager.updateProduct(pid, newProps);
                if (productUpdated && productUpdated.modifiedCount > 0) {
                    return res.json({
                        ok: true,
                        message: `product updated`
                    });

                }
                return res.status(400).json({
                    ok: false,
                    message: `product not updated`,
                    error: `No se puede actualizar el producto con productId ${productId}`
                });
            } catch (error) {
                console.log(
                    "🚀 ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.put ~ error:",
                    error
                );
            }
        });
    }
}

module.exports = ProductRoutes;
