module.exports = (sequelize, DataTypes) => {
  const Section = sequelize.define("Section", {
    sectionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  });

  return Section;
};
