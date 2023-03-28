const { Server } = require('socket.io')
const express = require("express");
const cors = require("cors");
const displayRoutes = require("express-routemap");
const handlebars = require("express-handlebars");
const path = require('path');
const corsConfig = require("./config/cors.config");
const { mongoDBconnection } = require("./db/mongo.config");
const {configConnection} = require('./db/mongo.config');
const ProductManager = require("./dao/managers/product-manager-db");
const messagesModel = require("./dao/models/messages.model");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const passport = require('passport');
const { initializePassport } = require('./config/passport.config');

const {NODE_ENV, PORT, SESSION_SECRET} = require('./config/config')
class App {
  app;
  env;
  port;
  server;

  constructor(routes) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = Number(PORT) || 5000;
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initHandlebars();
  }

  /**
   * getServer
   */
  getServer() {
    return this.app;
  }

  closeServer(done) {
    this.server = this.app.listen(this.port, () => {
      done();
    });
  }

  /**
   * connectToDatabase
   */
  async connectToDatabase() {
    // TODO: Inicializar la conexion
    await mongoDBconnection();
  }

  initializeMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(
      session({
        store: mongoStore.create({
          mongoUrl: configConnection.url,
          mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
          ttl: 60 * 3600,
        }),
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
      })
    );
    initializePassport();
    this.app.use(passport.initialize());
    this.app.use(passport.session())
    this.app.use(cors(corsConfig));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, '/public')));
  }

  /**
   * initializeRoutes
   */
  initializeRoutes(routes) {
    routes.forEach((route) => {
      this.app.use(`/`, route.router);
    });
  }
  
  listenWs(httpServer) {
    const io = new Server(httpServer);

    io.on("connection", async (socket) => {
      console.log(`New Socket Connection`)
      const productManager = new ProductManager();
      
      socket.on("addNewProduct", async product => {
          const { title='', description = '', code, price, status = true, stock, category = '', thumbnails = '' } = product;
          if(! title || ! description || !code || !price || !status || !stock || !category || !thumbnails){
            io.emit("productAdded", { added: false, product: null, error:'All fields are required to create a product' })
          }
          try {
              var regexPattern = new RegExp("true");
              const product = await productManager.addProduct(title.toString(), description.toString(), Number(price), thumbnails, code.toString(), Number(stock), regexPattern.test(status), category.toString());
              if(product){
                io.emit("productAdded", { added: true, product: product, error:null })
              }
          }
          catch (e) {
              io.emit("productAdded", { added: false, product: null, error:e })
          }
      });

      socket.on("message", async(message) => {
        console.log("🚀 ~ file: app.js:35 ~ socket.on ~ message", message,'user:', message.user,'mensaje:', message.message);
        
        const newMessage = await messagesModel.create({
          user: message.user,
          message: message.message,
        });

        if(newMessage) {
          const messages = await messagesModel.find({})
          console.log("🚀 ~ file: app.js:37 ~ socket.on ~ messages", messages);
          io.emit("messageLogs", messages);
        }
      });
    
      // authenticated channel
      socket.on("authenticated", async (user) => {
        console.log("🚀 ~ file: app.js:39 ~ socket.on ~ user", user);
        const messages = await messagesModel.find({});
        socket.broadcast.emit("newUserConnected", user);
        io.emit("loadMessages", messages);
      });
  
      // socket.emit("message", "comunicaicon 1 a 1 por canal message")
      // socket.broadcast.emit("messageForEveryOne", "mensaje para todos")
  
      // io.emit("messageAll", "saludos desde el backend")
  });
  }

  /**
   * listen
   */
  listen() {
    const httpServer = this.app.listen(this.port, () => {
      displayRoutes(this.app);
      console.log(`=================================`);
      console.log(`======= ENV: ${this.env} =======`);
      console.log(`🚀 App listening on the port ${this.port}`);
      console.log(`=================================`);

    });
    this.listenWs(httpServer);

  }

  initHandlebars() {
    this.app.engine("handlebars", handlebars.engine());
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "handlebars");
  }
}

module.exports = App;
