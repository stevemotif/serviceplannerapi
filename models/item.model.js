module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    itemId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sections",
        key: "sectionId",
      },
    },
  });

  return Item;
};
