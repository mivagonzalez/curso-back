const productsModel = require("../models/products.model");
const {ERRORS, CustomError } = require('../../services/errors/errors')
const { Logger } = require('../../helpers');

class ProductManager {
    constructor() {
        this.products = [];
    }

    getProductByFields = async(fields = {}) => {
        try {
            return await productsModel.findOne(fields);
        }catch(error){
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ getProductByFields=async ~ error:",error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get products with the query provided', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
    getProductsWithLimit = async(limit = null) => {
        try {
            return await productsModel.find().limit(limit);
        }catch(error){
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ getProductsWithLimit=async ~ error:",error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get products with the limit provided', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    addProduct = async (product) => {
        if(!product.code || product.title.length === 0 || product.description.length === 0 || product.category.length === 0 || !product.productId || product.productId.length === 0) {
            Logger.error("Product can not be created without all the fields",error)
            return null;
        }
        const existingProduct = await this.getProductByFields({ code: product.code });
        if(existingProduct){
            Logger.error("Product already exists",error)
            return null;
        }
        
        try {
            return await productsModel.create(product);

        } catch (error) {
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ addProduct=async ~ error:",error)
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create product with the values provided', ERRORS.CREATION_ERROR.code)
        }

    };

    getProducts = async (limit=10, page=1, sort, query={}) => {
        try {
            if(sort && (sort === 'asc' || sort ==='desc')) {
                return await productsModel.paginate(query, { limit: limit, page: page, sort:{"price": sort}, lean: true }) ?? null;
            }
            return await productsModel.paginate(query, { limit: limit, page: page, lean: true }) ?? null;
        } catch (error) {
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ getProducts=async ~ error:",error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get products with the query provided', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    };
    
    getProductById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await productsModel.findOne({ productId: id }) ?? null;
        } catch (error) {
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ getProductById=async ~ error:",error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get products with the id provided', ERRORS.INVALID_PARAMETER_ERROR.code)

        }
    }
    
    deleteProduct = async (id = '') => {
        try {
            if (!id || typeof (id) !== "string" || id.length < 1) {
                throw Error("El id ingresado es incorrecto");
            }
    
            return await productsModel.deleteOne({
                productId: id
            })
        } catch (error) {
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ deleteProduct=async ~ error:",error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not delete products with the id provided', ERRORS.INVALID_PARAMETER_ERROR.code)

        }
    }

    updateProduct = async (id = '', newProps = {} ) => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }
        const propsArr = Object.keys(newProps);
        if (propsArr.length === 0) {
            Logger.warning(`No hay props para actualizar para el producto con id ${id}`)
            return;
        }
        if(newProps && newProps['code']) {
            const productWithNewCode = await productsModel.find({ code: newProps['code']}) ?? null
            if(productWithNewCode) {
                throw Error(`product with code ${newProps['code']} already exists`); 
            }
        }
        try {
            const product = await this.getProductByFields({productId: id});
            let propsToEdit = {};
            
            propsArr.forEach(prop => {
                const isPropValid = product[prop] ?? false;
                if(prop !== 'productId' && isPropValid) {
                    propsToEdit={
                        ...propsToEdit,
                        [prop]: newProps[prop]
                    };
                }
                else{
                    Logger.error(`invalid prop ${prop}. It cant be modified`);
                }
            });      
            return await productsModel.updateOne({
                productId: id,
            },
            {
              $set:{ ...propsToEdit }  
            })
        } catch (error) {
            Logger.error("🚀 ~ file: Product.manager.js:15 ~ Product ~ updateProduct=async ~ error:",error)

            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not update products', ERRORS.INVALID_PARAMETER_ERROR.code)

        }
    }
};

module.exports = ProductManager;
