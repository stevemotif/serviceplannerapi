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
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });

  
    return Member;
  };
  