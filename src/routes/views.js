import express from 'express';
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'
import ProductManager from '../entities/product-manager/index.js'

const productManager = new ProductManager('product-test3.json');

const router = express();

router.engine('handlebars', handlebars.engine())

router.set('views', __dirname+'/views')

router.set('view engine', 'handlebars')

router.get('/', async (_, res) => {
    const products = await productManager.getProducts();

    let testProduct = {
        name:"Mauricio",
        style: 'index',
        products: products
    }

    res.render('index', testProduct);
});
export default router;