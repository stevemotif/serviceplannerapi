module.exports = (sequelize, Sequelize) => {
    const Church = sequelize.define('church', {
      churchId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      churchName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  
    return Church;
  };
  