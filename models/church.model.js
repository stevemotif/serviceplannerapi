module.exports = (sequelize, DataTypes) => {
  const Church = sequelize.define('Church', {
    churchId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    churchName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Church;
};
