
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isRequired = () => { throw Error("Parametro faltante. No se puede crear un Cart si falta algun parametro.") };

export class CartManager {
    #currentId = 1
    constructor(filePath = isRequired) {
        this.path = path.join(__dirname, filePath);
        this.carts = [];
        this.init()
    }

    init = async () => {
        if(!fs.existsSync(this.path)){
            console.log(`El archivo especificado ${this.path} no existe aun. Creando...`);
            await fs.promises.writeFile(this.path, "[]")
            console.log(`Archivo ${this.path} Creado!`)
            return;
        }
        const readCarts = fs.readFileSync(this.path);
        const carts = JSON.parse(readCarts);
        if(carts.length === 0) {
            return;
        }
        this.carts = carts;
        this.#currentId = carts[carts.length -1].id + 1;
        console.log('Cart Manager inicializado correctamente')
    }

    addCart = async () => {
        const newCart = {
            id: this.#currentId,
            products: [],
        };
        
        this.carts.push(newCart);
        this.#currentId +=1;
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    };
    getCartById = async (id = '') => {
        if (!fs.existsSync(this.path)) {
            console.warn(`El archivo ${this.path} no existe`)
            return null;
        }
        const readCarts = await fs.promises.readFile(this.path);
        const carts = JSON.parse(readCarts);
        const cart = carts.find(c => c.id === id); 
        if(!cart) {
            console.warn("Cart no encontrado");
            return null
        };
        return cart;
    }

    getCarts = async () => {
        if(fs.existsSync(this.path)){
            const readCarts = await fs.promises.readFile(this.path);
            const carts = JSON.parse(readCarts);
            return carts;
        }
        console.warn(`El archivo ${this.path} no existe`)
        return [];
    };
    
    getProductsByCartId = async (id = '') => {
        if (!fs.existsSync(this.path)) {
            console.warn(`El archivo ${this.path} no existe`)
            return null;
        }
        const readCarts = await fs.promises.readFile(this.path);
        const carts = JSON.parse(readCarts);
        const cart = carts.find(c => c.id === id); 
        if(!cart) {
            console.warn("Cart no encontrado");
            return null
        };
        return cart.products;
    }
    
    addProductToCart = async (cartId = '', productId) => {
        if (!fs.existsSync(this.path)) {
            console.warn(`El archivo ${this.path} no existe`)
            return null;
        }

        
        const readCarts = await fs.promises.readFile(this.path);
        const carts = JSON.parse(readCarts);      
        const cartIndex = carts.findIndex(c => c.id === cartId);
        const cart = carts[cartIndex];
        if(!cart) {
            console.warn("Cart no encontrado");
            return null
        };
        const productIndex = cart.products.findIndex(p => p.product === productId);
        const product = cart.products[productIndex];
        if(product) {
            this.carts[cartIndex].products[productIndex].quantity +=1;
        } else {
            this.carts[cartIndex].products.push({ product: productId, quantity: 1 });
        }
        await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }    
};

export default CartManager;