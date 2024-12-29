module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Role;
};
