'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through:models.UserBook,
        foreignKey: "bookId",
        otherKey: "userId"
      } )

      this.belongsToMany(models.Genre, {
        through:models.BookGenre,
        foreignKey: "bookId",
        otherKey: "genreId"
      } )
    }
  }
  Book.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    coverImageURL: DataTypes.STRING,
    readStatus: DataTypes.BOOLEAN,
    publicationDate: DataTypes.DATE,
    synopsis: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};