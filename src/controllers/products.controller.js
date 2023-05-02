const ProductManager = require("../dao/managers/product-manager-db");

class ProductsController {
    productManager = new ProductManager();

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
    validateGetProductsQueryParams = async (_, res, next) => {
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
    }

    getProducts = async (req, res) => {
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
    }

    deleteProduct = async (req, res) => {
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
    }

    updateProduct = async (req, res) => {
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
    }

    insertion = async (req, res) => {
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
    }
}

module.exports = ProductsController;