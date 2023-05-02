
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
}

module.exports = ProductsController;