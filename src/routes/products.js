import Express, { Router } from 'express';
// import TestProducts from '../entities/product-manager/mocks/test-products.json' assert { type: 'json' };
import ProductManager from '../entities/product-manager/index.js'

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

router.get('/', async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    const message = 'Lista de productos';
    const erroMessage = `El limite ingresado: ${limit} es invalido`;
    if (!limit) {
        res.status(200).json({
            ok: true,
            message: message,
            products: products
        });
    } else if (isNaN(limit) || Number(limit) < 0) {
        res.status(400).json({
            ok: false,
            message: erroMessage,
            products: {}
        });
    }
    else {
        res.status(200).json({
            ok: true,
            message: message,
            products: products.slice(0, Number(limit))
        })
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id ingresado ${pid}, es Invalido`,
            product: {}
        });
    }
    const product = await productManager.getProductById(Number(pid));
    if (!product) {
        res.status(404).json({
            ok: false,
            message: `No se encontro ningun producto con id: ${pid}`,
            product: {}
        });
    }
    else {
        res.status(200).json({
            ok: true,
            message: `producto encontrado`,
            product: product
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;

    if (isNaN(pid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id ingresado ${pid}, es Invalido`,
            product: {}
        });
    }
    const product = await productManager.getProductById(Number(pid));
    if (!product) {
        res.status(404).json({
            ok: false,
            message: `No se encontro ningun producto con id: ${pid}`,
            product: {}
        });
    }
    await productManager.deleteProduct(Number(pid));
    res.json({
        ok: true,
        message: "producto eliminado",
        producto: product
    })
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    if (isNaN(pid)) {
        res.status(400).json({
            ok: false,
            message: `Error el id ingresado ${pid}, es Invalido`,
            product: {}
        });
    }
    const product = await productManager.getProductById(Number(pid));
    if (!product) {
        res.status(404).json({
            ok: false,
            message: `No se encontro ningun producto con id: ${pid}`,
            product: {}
        });
    }

    const modifications = req.body;
    await productManager.updateProduct(Number(pid), modifications);
    const newProduct = await productManager.getProductById(Number(pid));
    res.json({
        ok: true,
        message: "producto modificado",
        producto: newProduct
    })
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    try {
        await productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
        res.status(200).json({
            ok: true,
            message: "producto creado",
        })
    }
    catch (e) {
        res.status(404).json({
            ok: false,
            message: `No se pudo agregar el producto. Error: ${e}`,
        });
    }
});

export default router;