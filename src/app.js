import Express from 'express';
import ProductsRouter from './routes/products.js'
import CartsRouter from './routes/carts.js'
const PORT = 8080;
const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`API RUNNING ON PORT: ${PORT}`);
});

app.get('/', (_, res) => {
    const message = `Bienvenido a mi rest api`;
    res.status(200).json({
        ok: true,
        message: message,
        products: {}
    });
});
app.use('/api/products', ProductsRouter);
app.use('/api/carts', CartsRouter);
