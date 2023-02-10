import ProductManager from "../index.js";

const productManager = new ProductManager('product-test3.json');
const products = await productManager.getProducts();
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