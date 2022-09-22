const Sequelize = require("sequelize");
const dbVars = process.env;

const dbConfig = {
  host: dbVars.DB_HOST,
  port: dbVars.DB_PORT,
  database: dbVars.DB_NAME,
  username: dbVars.DB_USER,
  password: dbVars.DB_PASSWORD,
  dialect: dbVars.DB_DIALECT,
};
const db = new Sequelize(dbConfig);

module.exports = db;
