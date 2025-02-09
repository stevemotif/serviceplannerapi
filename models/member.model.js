const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define("Member", {
    memberId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Member.beforeCreate(async (member) => {
    member.password = await bcrypt.hash(member.password, 10);
  });

  return Member;
};
