
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isRequired = () => { throw Error("Parametro faltante. No se puede crear un Producto si falta algun parametro.") };

export class ProductManager {
    #currentId = 1
    constructor(filePath = isRequired) {
        this.path = path.join(__dirname, filePath);
        this.products = [];
        this.init()
    }

    init = async () => {
        if(!fs.existsSync(this.path)){
            console.log(`El archivo especificado ${this.path} no existe aun. Creando...`);
            await fs.promises.writeFile(this.path, "[]")
            console.log(`Archivo ${this.path} Creado!`)
            return;
        }
        const readProducts = fs.readFileSync(this.path);
        const products = JSON.parse(readProducts);
        if(products.length === 0) {
            return;
        }
        this.products = products;
        this.#currentId = products[products.length -1].id + 1;
        console.log('Product Manager inicializado correctamente')
    }

    addProduct = async (title = this.isRequired(), description = this.isRequired(), price = this.isRequired(), thumbnails = [], code = this.isRequired(), stock = this.isRequired(), status = this.isRequired(), category = this.isRequired()) => {
        if(this.products.find(x => x.code === code)) {
            throw Error("El producto ya existe");
        }; 
        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnails: thumbnails,
            code: code,
            stock: stock,
            status: status,
            category: category,
            id: this.#currentId,
        };
        
        this.products.push(newProduct);
        this.#currentId +=1;
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    };

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const readProducts = await fs.promises.readFile(this.path);
            const products = JSON.parse(readProducts);
            return products;
        }
        console.warn(`El archivo ${this.path} no existe`)
        return [];
    };
    
    getProductById = async (id = '') => {
        if (!fs.existsSync(this.path)) {
            console.warn(`El archivo ${this.path} no existe`)
            return null;
        }
        const readProducts = await fs.promises.readFile(this.path);
        const products = JSON.parse(readProducts);
        const product = products.find(p => p.id === id); 
        if(!product) {
            console.warn("Producto no encontrado");
            return null
        };
        return product;
    }
    
    deleteProduct = async (id = '') => {
        const newProducts = this.products.filter(product => product.id !== id);
        this.products = newProducts;
        const writeProducts = JSON.stringify(newProducts, null, 2);
        await fs.promises.writeFile(this.path, writeProducts);
    }

    updateProduct = async (id = '', newProps = {} ) => {
        const newPropsArr = Object.keys(newProps);
        if (newPropsArr.length === 0) {
            console.warn(`No hay props para actualizar para el producto con id ${id}`)
            return;
        }
        const index = this.products.findIndex(producto => producto.id === id);
        newPropsArr.forEach(prop => {
            // chequeo que la prop no sea id y que el objeto tenga esa prop, es decir que la prop sea valida.
            const isPropValid = this.products[index][prop] ?? false;
            if(prop !== 'id' && isPropValid) {
                this.products[index][prop]=newProps[prop];
            }
            else{
                console.error('La propiedad ID no puede ser modificada');
            }
        });      
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
    }
};
