const productsModel = require("../models/products.model");
const { v4: uuidv4 } = require('uuid');


class ProductManager {
    constructor() {
        this.products = [];
    }

    getProductByFields = async(fields = {}) => {
        try {
            return await productsModel.findOne(fields);
        }catch(error){
            console.log(
                "🚀 ~ file: Product.manager.js:15 ~ Product ~ getProductByFields=async ~ error:",
                error
            );
        }
    }
    getProductsWithLimit = async(limit = null) => {
        try {
            return await productsModel.find().limit(limit);
        }catch(error){
            console.log(
                "🚀 ~ file: Product.manager.js:15 ~ Product ~ getProductByFields=async ~ error:",
                error
            );
        }
    }

    addProduct = async (title = '', description = '', price = 0, thumbnails = [], code, stock = 0, status = true, category = '') => {

        if(!code || title.length === 0 || description.length === 0 || category.length === 0 ) {
            console.log('Product can not be created without all the fields');
            return null;
        }
        const existingProduct = await this.getProductByFields({ code: code });
        if(existingProduct){
            console.log('Product already exists');
            return null;
        }
        
        try {
            const newThumbnails = Array.isArray(thumbnails) ? thumbnails : [thumbnails];
            return await productsModel.create({
                productId: uuidv4(),
                title: title,
                description: description,
                price: price,
                thumbnails: newThumbnails,
                code: code,
                stock: stock,
                status: status,
                category: category,
            });

        } catch (error) {
            console.log(
                "🚀 ~ file: Product.manager.js:45 ~ Product ~ addProduct=async ~ error:",
                error
            );
            return null;
        }

    };

    getProducts = async (limit=10, page=1, sort, query={}) => {
        try {
            if(sort && (sort === 'asc' || sort ==='desc')) {
                return await productsModel.paginate(query, { limit: limit, page: page, sort:{"price": sort}, lean: true }) ?? null;
            }
            return await productsModel.paginate(query, { limit: limit, page: page, lean: true }) ?? null;
        } catch (error) {
            console.log(
                "🚀 ~ file: product.manager.js:21 ~ ProductManager ~ getProducts= ~ error:",
                error
            );
        }
    };
    
    getProductById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await productsModel.findOne({ productId: id }) ?? null;
        } catch (error) {
            console.log(
                "🚀 ~ file: product.manager.js:21 ~ ProductManager ~ getProductById=async ~ error:",
                error
            );
        }
    }
    
    deleteProduct = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }

        return await productsModel.deleteOne({
            productId: id
        })
    }

    updateProduct = async (id = '', newProps = {} ) => {
        if (!id || typeof (id) !== "string" || id.length < 1) {
            throw Error("El id ingresado es incorrecto");
        }
        const propsArr = Object.keys(newProps);
        if (propsArr.length === 0) {
            console.warn(`No hay props para actualizar para el producto con id ${id}`)
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
                    console.error(`invalid prop ${prop}. It cant be modified`);
                }
            });      
            return await productsModel.updateOne({
                productId: id,
            },
            {
              $set:{ ...propsToEdit }  
            })
        } catch (error) {
            console.log(
                "🚀 ~ file: product.manager.js:21 ~ ProductManager ~ updateproduct=async ~ error:",
                error
            );
        }
    }
};

module.exports = ProductManager;
