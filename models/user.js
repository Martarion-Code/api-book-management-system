const {Role} = require('./role');
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      // define association here
      this.belongsToMany(models.Book, {
        through:models.UserBook,
        foreignKey: "userId",
        otherKey: "bookId"
      } )
      
      this.belongsTo(models.Role, {
        foreignKey: "roleId",
        as: "role",
      })
    }
  }
  User.init({
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
    } ,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};