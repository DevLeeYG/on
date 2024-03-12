const Sequelize = require('sequelize');
class User extends Sequelize.Model {
   static init(sequelize) {
      return super.init(
         {
            email: {
               type: Sequelize.STRING,
               allowNull: false,
               unique: true,
            },

            nickname: {
               type: Sequelize.STRING(20),
               allowNull: true,
            },
         },
         {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            underscored: false,
            paranoid: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
         },
      );
   }
   static associate(db) {}
}

module.exports = User;
