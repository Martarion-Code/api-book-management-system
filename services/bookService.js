const book = require('../database/book')



module.exports = {
    getAllBooks(){
        // return Book.findAll();
        const allBooks = book.getAllBooks();
        return allBooks;
    },

    getBooksByGenres(genres){
        const booksByGenres = book.getBooksByGenre(genres);
        return booksByGenres;
    }
    
}