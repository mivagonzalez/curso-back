const { config } = require("dotenv");

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const {
  API_VERSION,
  NODE_ENV,
  PORT,
  HOST,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  DB_USE_ATLAS,
  LOCAL_DB_HOST,
  LOCAL_DB_NAME,
  LOCAL_DB_PORT,
  SESSION_SECRET
} = process.env;

module.exports = {
  API_VERSION,
  NODE_ENV,
  PORT,
  HOST,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  DB_USE_ATLAS,
  LOCAL_DB_HOST,
  LOCAL_DB_NAME,
  LOCAL_DB_PORT,
  SESSION_SECRET
};
