const book = require('../database/book')



module.exports = {
    getAllBooks(req, res){
        // return Book.findAll();
        const allBooks = book.getAllBooks();
        return allBooks;
    }
}