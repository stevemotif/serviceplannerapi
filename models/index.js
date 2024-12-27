const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: "mysql",
  operatorsAliases: 0,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
const a= async ()=>{
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}}
a()
db.church = require('./church.model')(sequelize, Sequelize);

module.exports = db;
