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
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Section;
};
