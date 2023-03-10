const { connect } = require("mongoose");

const { DB_CNN } = require("../config/config");

const configConnection = {
  url: DB_CNN ?? `mongodb://127.0.0.1:27017/ecommerce`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const mongoDBconnection = async () => {
  try {
    await connect(configConnection.url, configConnection.options);
    console.log(`=================================`);
    console.log(
      `======= URL: ${configConnection.url.substring(0, 20)} =======`
    );
    console.log(`=================================`);
  } catch (error) {
    console.log(
      "🚀 ~ file: mongo.config.js:23 ~ mongoDBconnection ~ error:",
      error
    );
    throw new Error(error);
  }
};

module.exports = {
  configConnection,
  mongoDBconnection,
};
