const Book = require("../models").Book;

module.exports = {
  async getAllBooks() {
    const allBooks = await Book.findAll();
    return allBooks; 
  },
  async  getBooksByGenre(genres){
    await Book.findAll({
      where:{
        name: genres
      }
    })
  }
  };
