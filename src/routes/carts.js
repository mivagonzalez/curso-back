import Express, { Router } from 'express';
// import TestProducts from '../entities/product-manager/mocks/test-products.json' assert { type: 'json' };
import ProductManager from '../entities/product-manager/index.js'
import CartManager from '../entities/cart-manager/index.js'

// Creada solo para correccion. Inicializa el Product Manager con productos de prueba.
// export const initializeProducts = async () => {
//     const productManager = new ProductManager('product-test3.json');
//     const products = await productManager.getProducts();
//     if (!products || products.length === 0) {
//         const { products: mockProducts } = TestProducts;
//         console.log(products, 'Products antes de agregar');
//         await productManager.addProduct(mockProducts[0].title, mockProducts[0].description, mockProducts[0].price, mockProducts[0].thumbnail, mockProducts[0].code, mockProducts[0].stock);
//         await productManager.addProduct(mockProducts[1].title, mockProducts[1].description, mockProducts[1].price, mockProducts[1].thumbnail, mockProducts[1].code, mockProducts[1].stock);
//         await productManager.addProduct(mockProducts[2].title, mockProducts[2].description, mockProducts[2].price, mockProducts[2].thumbnail, mockProducts[2].code, mockProducts[2].stock);
//         await productManager.addProduct(mockProducts[3].title, mockProducts[3].description, mockProducts[3].price, mockProducts[3].thumbnail, mockProducts[3].code, mockProducts[3].stock);
//         await productManager.addProduct(mockProducts[4].title, mockProducts[4].description, mockProducts[4].price, mockProducts[4].thumbnail, mockProducts[4].code, mockProducts[4].stock);
//         await productManager.addProduct(mockProducts[5].title, mockProducts[5].description, mockProducts[5].price, mockProducts[5].thumbnail, mockProducts[5].code, mockProducts[5].stock);
//         await productManager.addProduct(mockProducts[6].title, mockProducts[6].description, mockProducts[6].price, mockProducts[6].thumbnail, mockProducts[6].code, mockProducts[6].stock);
//         await productManager.addProduct(mockProducts[7].title, mockProducts[7].description, mockProducts[7].price, mockProducts[7].thumbnail, mockProducts[7].code, mockProducts[7].stock);
//         await productManager.addProduct(mockProducts[8].title, mockProducts[8].description, mockProducts[8].price, mockProducts[8].thumbnail, mockProducts[8].code, mockProducts[8].stock);
//         await productManager.addProduct(mockProducts[9].title, mockProducts[9].description, mockProducts[9].price, mockProducts[9].thumbnail, mockProducts[9].code, mockProducts[9].stock);
//     };
// };

const router = Router();

router.use(Express.json());
router.use(Express.urlencoded({ extended: true }));
const productManager = new ProductManager('product-test3.json');
const cartManager = new CartManager('cart-test3.json');

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    if (isNaN(cid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id ingresado ${cid}, es Invalido`,
            user: {}
        });
    }
    const products = await cartManager.getProductsByCartId(Number(cid));
    if (!products) {
        res.status(404).json({
            ok: false,
            message: `No se encontro ningun producto para el carrito con id: ${cid}`,
            user: {}
        });
    }
    else {
        res.status(200).json({
            ok: true,
            message: `productos encontrados`,
            user: products
        });
    }
});


router.post("/", async (_, res) => {
    try {
        await cartManager.addCart();
        res.status(200).json({
            ok: true,
            message: "Cart creado",
        })
    }
    catch (e) {
        res.status(404).json({
            ok: false,
            message: `No se pudo agregar el Cart. Error: ${e}`,
        });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    if (isNaN(cid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id  del cart ingresado ${cid}, es Invalido`,
            user: {}
        });
    }
    else if (isNaN(pid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id del producto ingresado ${pid}, es Invalido`,
            user: {}
        });
    }
    const product = await productManager.getProductById(Number(pid));
    const cart = await cartManager.getCartById(Number(cid));
    if(!product){
        res.status(400).json({
            ok: false,
            message: `Error el producto con id ${pid}, No existe`,
            user: {}
        });
    }else if(!cart){
        res.status(400).json({
            ok: false,
            message: `Error el cart con id ${cid}, No existe`,
            user: {}
        });
    } else {
        await cartManager.addProductToCart(Number(cid), Number(pid));
        res.status(200).json({
            ok: true,
            message: "Producto Agregado",
        })
    }
});

export default router;