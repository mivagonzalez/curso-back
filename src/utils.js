const path = require("path");
const multer = require("multer");
const bcrypt = require('bcrypt');
const { faker } = require("@faker-js/faker");
const { Logger } = require('./helpers')

faker.locale = "es";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      let dest = 'documents';
      if(file.mimetype.includes('image')) {
          if(file.fieldname === 'profile') {
              dest = 'profiles';
          } else if(file.fieldname === 'product') {
              dest = 'products';
          }
      }
      cb(null, path.join(`${__dirname}/public/uploads`, dest));
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploader = multer({
  storage,
  onError: function (err, next) {
    Logger.error(err);
    next();
  },
});

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const arePasswordsEqual= (password, newPassword) => bcrypt.compareSync(newPassword, password);

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

const generateProducts = (productsAmount) => {

  const products = [];

  for (let index = 0; index < productsAmount; index++) {
    const product = {
      _id: faker.database.mongodbObjectId(),
      productId: faker.datatype.uuid(),
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      code: faker.datatype.uuid(),
      price: faker.commerce.price(),
      status: faker.datatype.boolean(),
      stock: faker.random.numeric(3),
      category: faker.commerce.product(),
      thumbnails: [faker.image.fashion(), faker.image.fashion()]
    };

    products.push(product);
  }
  return products;
};

module.exports = { uploader, createHash, isValidPassword, generateProducts, arePasswordsEqual };
