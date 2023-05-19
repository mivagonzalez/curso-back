const App = require("./app");
const viewsRoutes = require("./routes/views.routes");
const CartsRoutes = require("./routes/cart.routes");
const ProductsRoutes = require("./routes/products.routes");
const SessionRoutes = require("./routes/session.routes");
const TicketRoutes = require("./routes/ticket.routes");
const MockRoutes = require("./routes/mock.routes");
const LogsRoutes = require("./routes/logs.routes");

const app = new App([
  new viewsRoutes(),
  new CartsRoutes(),
  new ProductsRoutes(),
  new SessionRoutes(),
  new TicketRoutes(),
  new MockRoutes(),
  new LogsRoutes(),
]);

app.listen();
