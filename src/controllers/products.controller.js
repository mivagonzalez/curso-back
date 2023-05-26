const productData = require("../routes/mock-data")
const { ProductsService } = require('../services')
const { CartService } = require('../services')
const { API_VERSION } = require('../config/config');
const { ProductDTO } = require('../dto')
const { Logger, ROLES } = require('../helpers')

class ProductsController {

    validateNewPropsForUpdateProducts = async (req, res, next) => {
        const newProps = req.body;
        const propsArr = Object.keys(newProps);
        if (propsArr.length === 0) {
            return res.status(400).json({
                ok: false,
                message: `product not updated`,
                error: `No hay props para actualizar`
            });
        }
        if (newProps['productId']) {
            return res.status(400).json({
                ok: false,
                message: `product not updated`,
                error: `No se puede actualizar el producto con productId ${productId}`
            });
        }
        next();
    };
    validateGetProductsQueryParams = async (req, res, next) => {
        const { limit = 10, page = 1, sort, query } = req.query;
        if (isNaN(limit) || Number(limit) < 0) {
            return res.status(400).json({
                ok: false,
                message: `El limite ingresado: ${limit} es invalido`,
                products: null
            });
        }
        if (isNaN(page) || Number(page) < 0) {
            return res.status(400).json({
                ok: false,
                message: `El page ingresado: ${page} es invalido`,
                products: null
            });
        }
        if (sort && (sort !== 'asc' && sort !== 'desc')) {
            return res.status(400).json({
                ok: false,
                message: `El sort ingresado: ${sort} es invalido`,
                products: null
            });
        }
        if (query && query !== 'stock' && (query.length <= 1 || !isNaN(query))) {
            return res.status(400).json({
                ok: false,
                message: `El query ingresado: ${query} es invalido`,
                products: null
            });
        }
        next();
    };

    validateBodyForAddProduct = async (req, res, next) => {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || (status !== true && status !== false) || !stock || !category || !thumbnails) {
            return res.status(400).json({
                message: `Product not created1`,
                product: null,
                error: "You forget to pass one of: title, description, code, price, status, stock, category, thumbnails ",
                ok: false
            });
        }

        if (!Number.isInteger(price) || !Number.isInteger(stock)) {
            return res.status(400).json({
                message: `Product not created2`,
                product: null,
                error: "Stock and Price must be numbers",
                ok: false
            });
        }
        if (typeof (title) !== 'string' || typeof (description) !== 'string' || typeof (code) !== 'string' || typeof (category) !== 'string' || (typeof (thumbnails) !== 'string' && !Array.isArray(thumbnails))) {
            return res.status(400).json({
                message: `Product not created3`,
                product: null,
                error: "Title, description, code and category must be strings. Thumbnails can be a string or an array of strings",
                ok: false
            });

        }
        if (typeof (status) !== 'boolean') {
            return res.status(400).json({
                message: `Product not created4`,
                product: null,
                error: "Status must be a boolean",
                ok: false,
            });
        }
        next();
    };

    validatePIDParam = async (_, res, next, pid) => {
        if (!pid || typeof (pid) !== 'string') {
            return res.status(400).json({
                ok: false,
                message: `product not deleted`,
                error: `Error el id ingresado ${pid}, es Invalido`
            });
        }
        next();
    };

    addProduct = async (req, res) => {
        try {
            const { title, description, code, price, status, stock, category, thumbnails } = req.body;
            const productDTO = new ProductDTO({ title, description, code, price, status, stock, category, thumbnails, owner: req.user.email })
            const product = await ProductsService.addProduct(productDTO);
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
                message: `Product Not created, Error: ${error}`,
                product: null,
                error: error.message
            });
        }
    }

    getProducts = async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query={} } = req.query;
            let queryObject = {};
            if (query && query === 'stock') {
                queryObject = { stock: { $gt: 0 } }
            }
            else if (query && query.length > 1 && isNaN(query)) {

                queryObject = {
                    category: query
                }
            }
            else {
                queryObject = {}
            }
            const sortQueryParam = sort && `&sort=${sort}` || '';
            
            const products = await ProductsService.getProducts(limit, page, sort, queryObject);
            if(!products || products.length === 0){
                return res.status(400).json({
                    status: 'error',
                    payload: null,
                    totalPages: null,
                    prevPage: null,
                    nextPage: null,
                    page: page,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevLink: null,
                    nextLink: null,
                });
            }

            const {
                docs,
                limit: limitPag,
                totalPages,
                hasPrevPage,
                hasNextPage,
                nextPage,
                prevPage,
                page: currentPage,
            } = products;

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
        } catch (error) {
            Logger.error(
                "🚀 ~ file: cart.routes.js:43 ~ CartRoutes ~ this.router.get ~ error:",
                error
            );
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await ProductsService.getProductById(pid);
            if(req.user.role === ROLES.PREMIUM){
                if(product.owner !== req.user.email){
                    return res.status(401).json({
                        ok: false,
                        message: `product not deleted`,
                        error: "You can't delete products you don't own."
                    });
                }
            }
            if(req.user.role !== ROLES.USER) {
                const deletedProducts = await ProductsService.deleteProduct(pid);
                const deletedProductsFromAllcarts = await CartService.deleteProductFromAllCarts(pid);
                if (deletedProducts && deletedProducts.deletedCount > 0 && deletedProductsFromAllcarts && deletedProductsFromAllcarts.acknowledged === true) {
                    return res.json({
                        ok: true,
                        message: `Product deleted`,
                        deletedProducts: deletedProducts,
                        deletedProductsFromAllcarts: deletedProductsFromAllcarts
                    });
                }
            }
            return res.status(500).json({
                ok: false,
                message: `product not deleted`,
                error: "You are not entittled to delete the product"
            });
        } catch (error) {
            Logger.error(
                "🚀 ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.delete ~ error:",
                error
            );
        }
    }

    updateProduct = async (req, res) => {
        try {
            const { pid } = req.params;
            const product = await ProductsService.getProductById(pid);
            if(req.user.role === ROLES.PREMIUM){
                if(product.owner !== req.user.email){
                    return res.status(401).json({
                        ok: false,
                        message: `product not updated`,
                        error: "You can't update products you don't own."
                    });
                }
            }
            if(req.user.role !== ROLES.USER) {
                const newProps = req.body;
                const productUpdated = await ProductsService.updateProduct(pid, newProps);
                if (productUpdated && productUpdated.modifiedCount > 0) {
                    return res.json({
                        ok: true,
                        message: `product updated`
                    });
                    
                }
            }
                return res.status(401).json({
                    ok: false,
                    message: `product not updated`,
                    error: `No se puede actualizar el producto con productId ${pid}. No tenes permisos para hacerlo`
                });
            } catch (error) {
                Logger.error(
                    "🚀 ~ file: product.routes.js:43 ~ ProductRoute ~ this.router.put ~ error:",
                    error
            );
        }
    }

    insertion = async (req, res) => {
        try {
            let result = await ProductsService.insertion(productData);
            return res.json({
                message: "all the products are inserted succesfully",
                students: result,
            });
        } catch (error) {
            Logger.error(
                "🚀 ~ file: products.routes.js:15 ~ router.get.insertion ~ error:",
                error
            );
        }
    }
}

module.exports = ProductsController;