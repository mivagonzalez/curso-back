const App = require("./app");
const viewsRoutes = require("./routes/views.routes");
const CartsRoutes = require("./routes/cart.routes");
const ProductsRoutes = require("./routes/products.routes");

const app = new App([
  new viewsRoutes(),
  new CartsRoutes(),
  new ProductsRoutes(),
]);

app.listen();
