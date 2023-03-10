const { Router } = require("express");
const ProductManager = require("../dao/managers/product-manager-db");

class ProductRoutes {
    path = "/api/v1/products";
    router = Router();
    productManager = new ProductManager();

    constructor() {
        this.initCoursesRoutes();
    }

    initCoursesRoutes() {

        this.router.post(`${this.path}`, async (req, res) => {
            try {
                const { title, description, code, price, status, stock, category, thumbnails } = req.body;

                if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
                    return res.status(400).json({
                        message: `Product not created`,
                        product: null,
                        error: "You forget to pass one of: title, description, code, price, status, stock, category, thumbnails ",
                        ok: false
                    });
                }

                if (!Number.isInteger(price) || !Number.isInteger(stock)) {
                    return res.status(400).json({
                        message: `Product not created`,
                        product: null,
                        error: "Stock and Price must be numbers",
                        ok: false
                    });
                }
                if (typeof (title) !== 'string' || typeof (description) !== 'string' || typeof (code) !== 'string' || typeof (category) !== 'string' || (typeof (thumbnails) !== 'string' && !Array.isArray(thumbnails))) {
                    return res.status(400).json({
                        message: `Product not created`,
                        product: null,
                        error: "Title, description, code and category must be strings. Thumbnails can be a string or an array of strings",
                        ok: false
                    });

                }
                if (typeof (status) !== 'boolean') {
                    return res.status(400).json({
                        message: `Product not created`,
                        product: null,
                        error: "Status must be a boolean",
                        ok: false,
                    });
                }
                const product = await this.productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
                if (product) {
                    return res.json({
                        message: `Product created succesfully`,
                        product: product,
                        ok: true
                    });
                }

                return res.json({
                    message: `Product not created`,
                    product: null,
                    ok: false,
                });
            } catch (error) {
                return res.status(400).json({
                    ok: false,
                    message: `Product Not created`,
                    product: null,
                    error: error.message
                });
            }
        });

        this.router.get(`${this.path}`, async (req, res) => {
            try {
                const { limit } = req.query;
                if (!limit) {
                    const products = await this.productManager.getProducts();
                    return res.json({
                        message: `Products found successfully without limit`,
                        products: products,
                        ok: true
                    });
                }
                else if (isNaN(limit) || Number(limit) < 0) {
                    return res.status(400).json({
                        ok: false,
                        message: `El limite ingresado: ${limit} es invalido`,
                        products: null
                    });
                }
                const products = await this.productManager.getProductsWithLimit(limit);
                if (products) {
                    return res.json({
                        message: `Products found successfully`,
                        products: products,
                        ok: true
                    });
                }
                return res.status(400).json({
                    ok: false,
                    message: `Products not found`,
                    products: null
                });
            } catch (error) {
                console.log(
                    "???? ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get ~ error:",
                    error
                );
            }
        });
        this.router.get(`${this.path}/:pid`, async (req, res) => {
            try {
                const { pid } = req.params;
                if(!pid || typeof(pid) != 'string'){
                return res.status(400).json({
                    message: `id type is not correct or its too short`,
                    product: null,
                    ok:false
                });
                }
                
                const product = await this.productManager.getProductById(pid);
                if (product) {
                    return res.json({
                        message: `Product found successfully`,
                        product: product,
                        ok: true
                    });
                }
                return res.status(400).json({
                    ok: false,
                    message: `Product not found`,
                    product: null,
                    ok: false
                });
            } catch (error) {
                console.log(
                    "???? ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get.pid ~ error:",
                    error
                );
            }
        });

        this.router.delete(`${this.path}/:pid`, async (req, res) => {
            try {
                const { pid } = req.params;

                if (!pid || typeof(pid) !== 'string') {
                    return res.status(400).json({
                        ok: false,
                        message: `product not deleted`,
                        error: `Error el id ingresado ${pid}, es Invalido`
                    });
                }

                const deletedProducts = await this.productManager.deleteProduct(pid);
                if(deletedProducts && deletedProducts.deletedCount > 0) {
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
                    "???? ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.delete ~ error:",
                    error
                );
            }
        });

        this.router.put(`${this.path}/:pid`, async (req, res) => {
            try {
                const { pid } = req.params;
                const newProps = req.body;
                if (!pid || typeof(pid) !== 'string' || pid.length < 1) {
                    return res.status(400).json({
                        ok: false,
                        message: `product not updated`,
                        error: `Error el id ingresado ${pid}, es Invalido`
                    });
                }
                
                const propsArr = Object.keys(newProps);
                if (propsArr.length === 0) {
                    return res.status(400).json({
                        ok: false,
                        message: `product not updated`,
                        error: `No hay props para actualizar`
                    });
                }
                if(newProps['productId']) {
                    return res.status(400).json({
                        ok: false,
                        message: `product not updated`,
                        error: `No se puede actualizar el producto con productId ${productId}`
                    });
                }
                
                const productUpdated = await this.productManager.updateProduct(pid, newProps);
                if(productUpdated && productUpdated.modifiedCount > 0) {
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
                    "???? ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.put ~ error:",
                    error
                );
            }
        }); 
    }
}

module.exports = ProductRoutes;
