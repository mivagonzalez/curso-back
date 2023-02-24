import Express from 'express';
import ProductsRouter from './routes/products.js'
import ViewsRouter from './routes/views.js'
import CartsRouter from './routes/carts.js'
import __dirname from './utils.js'

const PORT = 8080;
const app = Express();
app.use(Express.static(__dirname+'/public'))

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`API RUNNING ON PORT: ${PORT}`);
});

app.use('/api/products', ProductsRouter);
app.use('/api/carts', CartsRouter);
app.use('/', ViewsRouter);
