const cartsModel = require("../models/carts.model");
const productsModel = require("../models/products.model");
const { v4: uuidv4 } = require('uuid');
const { ERRORS, CustomError } = require('../services/errors');

class CartManager {
    constructor() {
        this.carts = [];
    }

    addCart = async () => {
        try {
            const newCart = await cartsModel.create({
                cartId: uuidv4(),
                products: [],
            });

            return newCart;
        } catch (error) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addCart=async ~ error:",
                error
            );
            CustomError.createError(
                'Add Cart Error',
                'Error trying to create a new cart',
                'Database returned an error when tried to create a cart',
                ERRORS.DATABASE_ERROR
            );
        }
    };

    getCartById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await cartsModel.find({ cartId: id });
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.manager.js:21 ~ CartsManager ~ getCartById=async ~ error:",
                error
            );
            CustomError.createError(
                'Get Cart By Id Error',
                'Error trying to get a cart by id',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }

    getCarts = async () => {
        try {
            return await cartsModel.find({});
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.manager.js:21 ~ CoursesManager ~ getCarts= ~ error:",
                error
            );
            CustomError.createError(
                'Get Carts Error',
                'Error trying to get carts ',
                'Database returned an error when tried to get carts',
                ERRORS.DATABASE_ERROR
            );
        }
    };

    getProductsByCartId = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }

        try {
            const cart = await cartsModel.findOne({ cartId: id }).populate('products.product') ?? null;
            return cart?.products || null;
        } catch (error) {
            console.log(
                "🚀 ~ file: carts.manager.js:21 ~ CartsManager ~ getProductsByCartId=async ~ error:",
                error
            );
            CustomError.createError(
                'Get product By cart Id Error',
                'Error trying to get a product by cart by id',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }

    addProductToCart = async (cartId = '', productId) => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        else if (!productId || typeof (productId) !== "string" || productId.length < 1) {
            throw Error("El id del product ingresado es incorrecto");
        }
        try {
            const cart = await cartsModel.findOne({
                cartId: cartId,
            }) ?? null;

            if (!cart) {
                throw Error(`El cart con id ${cartId} no existe o no se pudo encontrar`);
            }
            const product = await productsModel.findOne({
                productId: productId,
            }) ?? null;

            if (!product) {
                throw Error(`El Product con id ${productId} no existe o no se pudo encontrar`);
            }
            if (cart.products.find(p => p.productId == productId)) {
                return await cartsModel.updateOne(
                    { cartId: cartId, "products.productId": productId},
                    { $inc: {"products.$.quantity": 1 } },
                )
            } else {
                const newProduct = {
                    productId: productId,
                    quantity: 1,
                    product: product._id
                }
                return await cartsModel.updateOne(
                    { cartId: cartId },
                    { $addToSet: {"products": newProduct } }
                )  
            }
        }catch(e) {
            console.log(
                'No se pudo agregar el producto. Error:',e
            );
            CustomError.createError(
                'Add product to cart Error',
                'Error trying to add a product to a cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }

    updateProductQuantityForCart = async (cartId = '', productId, quantity=1) => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        else if (!productId || typeof (productId) !== "string" || productId.length < 1) {
            throw Error("El id del product ingresado es incorrecto");
        }
        try {
            const cart = await cartsModel.findOne({
                cartId: cartId,
            }) ?? null;

            if (!cart) {
                throw Error(`El cart con id ${cartId} no existe o no se pudo encontrar`);
            }
            const product = await productsModel.findOne({
                productId: productId,
            }) ?? null;

            if (!product) {
                throw Error(`El Product con id ${productId} no existe o no se pudo encontrar`);
            }
            if (cart.products.find(p => p.productId == productId)) {
                return await cartsModel.updateOne(
                    { cartId: cartId, "products.productId": productId},
                    { $set: {"products.$.quantity": quantity } },
                    )
                } else {  
                    throw Error(`El Product con id ${productId} no existe en el cart no se pudo encontrar`);
            }
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
            );
            CustomError.createError(
                'update product quantity Error',
                'Error trying to update a product from a cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }

    deleteProductFromCart = async (cartId = '', productId) => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        else if (!productId || typeof (productId) !== "string" || productId.length < 1) {
            throw Error("El id del product ingresado es incorrecto");
        }
        try {
            const cart = await cartsModel.findOne({
                cartId: cartId,
            }) ?? null;

            if (!cart) {
                throw Error(`El cart con id ${cartId} no existe o no se pudo encontrar`);
            }
            const product = await productsModel.findOne({
                productId: productId,
            }) ?? null;

            if (!product) {
                throw Error(`El Product con id ${productId} no existe o no se pudo encontrar`);
            }

            const currentProduct = cart.products.find(p => p.productId == productId)
            if (currentProduct && currentProduct.quantity >= 1) {
                return await cartsModel.updateOne(
                    { cartId: cartId, "products.productId": productId},
                    { $inc: {"products.$.quantity": -1 } },
                )
            } else {
                return await cartsModel.updateOne(
                    { cartId: cartId },
                    { products: cart.products.filter(p => p.productId !== currentProduct.productId) }
                )  
            }
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
            );
            CustomError.createError(
                'Delete product Error',
                'Error trying to delete a product from a cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }

    deleteProductFromAllCarts = async (productId) => {
        if (!productId || typeof (productId) !== "string" || productId.length < 1) {
            throw Error("El id del producto ingresado es incorrecto");
        }
        try {
            return await cartsModel.updateMany(
                { "products.productId": productId},
                { $pull: {"products":{"productId": productId } } },
            )
        }catch(e) {
            console.log(
                "🚀 Error deleting all products that matches with productid", productId,
                e
            );
            CustomError.createError(
                'Delete product from all carts Error',
                'Error trying to delete a products from all carts',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }
    deleteAllProductUnitsFromCart = async (cartId, productId) => {
        if (!productId || typeof (productId) !== "string" || productId.length < 1) {
            throw Error("El id del producto ingresado es incorrecto");
        }
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        try {
            return await cartsModel.updateMany(
                { "cartId": cartId},
                { $pull: {"products":{"productId": productId } } },
            )
        }catch(e) {
            console.log(
                "🚀 Error deleting all products that matches with productid", productId,'from cart',cartId,
                e
            );
            CustomError.createError(
                'Delete all product units from cart Error',
                'Error trying to delete all product units from cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }
    
    deleteAllProductsFromCart = async (cartId = '') => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        try {
            const cart = await cartsModel.findOne({
                cartId: cartId,
            }) ?? null;

            if (!cart) {
                throw Error(`El cart con id ${cartId} no existe o no se pudo encontrar`);
            }
            return await cartsModel.updateOne(
                    { cartId: cartId},
                    { products:[] },
                )
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
            );
            CustomError.createError(
                'Delete all products from cart Error',
                'Error trying to delete all products from cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }
    updateProductsForCart = async (cartId = '', products = []) => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        else if (!products || products.length < 1) {
            return null
        }
        try {
            const cart = await cartsModel.findOne({
                cartId: cartId,
            }) ?? null;

            if (!cart) {
                console.log(`El cart con id ${cartId} no existe o no se pudo encontrar`);
                return null;
            }
            return await cartsModel.updateOne(
                    { cartId: cartId},
                    { products:products },
                )
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
            );
            CustomError.createError(
                'Update all products from cart Error',
                'Error trying to update all products from cart',
                'A parameter passed to carts model is possible missing or wrong',
                ERRORS.INVALID_PARAMETER_ERROR
            );
        }
    }
};

module.exports = CartManager;