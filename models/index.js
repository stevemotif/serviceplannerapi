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
db.church = require('./church.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
})();


module.exports = db;
