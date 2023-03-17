const cartsModel = require("../models/carts.model");
const productsModel = require("../models/products.model");
const { v4: uuidv4 } = require('uuid');

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
                console.log(newProduct)
                return await cartsModel.updateOne(
                    { cartId: cartId },
                    { $addToSet: {"products": newProduct } }
                )  
            }
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
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
        }
    }
    updateProductsForCart = async (cartId = '', products = []) => {
        if (!cartId || typeof (cartId) !== "string" || cartId.length < 1) {
            throw Error("El id del cart ingresado es incorrecto");
        }
        else if (!products || products.length < 1) {
            console.log('el array de productos recibido esta vacio')
            return null
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
                    { products:products },
                )
        }catch(e) {
            console.log(
                "🚀 ~ file: cart.manager.js:45 ~ CartManager ~ addProductToCart=async ~ error:",
                e
            );
        }
    }
};

module.exports = CartManager;