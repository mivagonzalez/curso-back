
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


    init = () => {
        if(!fs.existsSync(this.path)){
            console.log(`El archivo especificado ${this.path} no existe aun.`)
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

    
    addProduct = async (title = this.isRequired(), description = this.isRequired(), price = this.isRequired(), thumbnail = this.isRequired(), code = this.isRequired(), stock = this.isRequired()) => {
        if(this.products.find(x => x.code === code)) {
            throw Error("El producto ya existe");
        }; 
        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock,
            id: this.#currentId
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
            return {};
        }
        const readProducts = await fs.promises.readFile(this.path);
        const products = JSON.parse(readProducts);
        const product = products.find(p => p.id === id); 
        if(!product) {
            throw Error("Producto no encontrado");
        };
        return product;
    }
    
    deleteProduct = async (id = '') => {
        const newProducts = this.products.filter(product => product.id !== id);
        this.products = newProducts;
        const writeProducts = JSON.stringify(newProducts);
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

const productManager = new ProductManager('product-test3.json');
// const products = await productManager.getProducts();
// console.log(products,'Products antes de agregar');
// await productManager.addProduct("prod1", "prod1", 200, "sin imagen", "12",25);
// await productManager.addProduct("prod2", "prod2", 200, "sin imagen", "14",23);
// await productManager.addProduct("prod3", "prod3", 200, "sin imagen", "16",21);
// const products2 = await productManager.getProducts();
// console.log(products2,'products despues de agregar');
// await productManager.deleteProduct(2);
// const products3 = await productManager.getProducts();
// console.log(products3,'products despues de eliminar');
// await productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "sin imagen", "abc123",25);
// const products4 = await productManager.getProducts();
// console.log(products4,'agrego nuevamente 1')
// console.log(await productManager.getProductById(2), 'getById con id existente')
// console.log(await productManager.getProductById(3), ' getById con id inexistente')
// await productManager.updateProduct(1,{ title: 'El CODIGO FUNCIONA BIEN2',id: 321 });
// const products5 = await productManager.getProducts();
// console.log(products5,'agrego nuevamente 1')
