import { ProductManager } from './entities/product-manager/product-manager.js';
import Express from 'express';
import ProductsRouter from './routes/products.js'
import ViewsRouter from './routes/views.js'
import CartsRouter from './routes/carts.js'
import __dirname from './utils.js'
import { Server } from 'socket.io'

const PORT = 8080;
const app = Express();
app.use(Express.static(__dirname + '/public'))

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
    console.log(`API RUNNING ON PORT: ${PORT}`);
});

const io = new Server(httpServer)

io.on("connection", (socket) => {
    console.log("Nueva conexion id:" + socket.id);
    const productManager = new ProductManager('product-test3.json');
    
    socket.on("addNewProduct", async product => {
        console.log('NUEVO PRODUCTO', product);
        
        const { title, description, code, price, status, stock, category, thumbnails } = product;
        console.log(title, description, code, price, status, stock, category, thumbnails)
        try {
            await productManager.addProduct(title, description, price, thumbnails, code, stock, status, category);
            io.emit("productAdded", { added: true, product: product, error:null })
        }
        catch (e) {
            io.emit("productAdded", { added: false, product: null, error:e })
        }
    })

    // socket.emit("message", "comunicaicon 1 a 1 por canal message")
    // socket.broadcast.emit("messageForEveryOne", "mensaje para todos")

    // io.emit("messageAll", "saludos desde el backend")
});

app.use('/api/products', ProductsRouter);
app.use('/api/carts', CartsRouter);
app.use('/', ViewsRouter);
