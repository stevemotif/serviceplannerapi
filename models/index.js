const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  operatorsAliases: 0,
  dialect: "mysql",
  dialectModule: require("mysql2"),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.church = require("./church.model")(sequelize, Sequelize);
db.role = require("./role.model")(sequelize, Sequelize);
db.member = require("./member.model")(sequelize, Sequelize);
db.section = require("./section.model")(sequelize, Sequelize);
db.item = require("./item.model")(sequelize, Sequelize);
db.service = require("./service.model")(sequelize, Sequelize);

// Relationships
db.role.hasMany(db.member, { foreignKey: "roleId", as: "members" });
db.member.belongsTo(db.role, { foreignKey: "roleId", as: "role" });

db.section.hasMany(db.item, { foreignKey: "sectionId", as: "items" });
db.item.belongsTo(db.section, { foreignKey: "sectionId", as: "section" });

db.member.hasMany(db.church, { foreignKey: "createdBy", as: "churches" });
db.church.belongsTo(db.member, { foreignKey: "createdBy", as: "creator" });

db.member.hasMany(db.church, { foreignKey: "adminId", as: "churchesAdmin" });
db.church.belongsTo(db.member, { foreignKey: "adminId", as: "admin" });

db.member.hasMany(db.section, { foreignKey: "adminId", as: "sectionsAdmin" });
db.section.belongsTo(db.member, { foreignKey: "adminId", as: "admin" });

db.member.hasMany(db.section, { foreignKey: "createdBy", as: "section" });
db.section.belongsTo(db.member, { foreignKey: "createdBy", as: "creator" });

db.member.hasMany(db.member, {
  foreignKey: "createdBy",
  as: "createdMembers",
});

db.member.belongsTo(db.member, {
  foreignKey: "createdBy",
  as: "creator",
});

db.member.hasMany(db.member, {
  foreignKey: "adminId",
  as: "adminMember",
});
db.member.belongsTo(db.member, {
  foreignKey: "adminId",
  as: "admin",
});

// (async () => {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("Database synchronized successfully.");
//   } catch (error) {
//     console.error("Error synchronizing the database:", error);
//   }
// })();

module.exports = db;
