const book = require('../database/book')



module.exports = {
    async getAllBooks(){
        const allBooks = await book.getAllBooks();
        return allBooks;
    },

    getBooksByGenres(genres){
        const booksByGenres = book.getBooksByGenre(genres);
        return booksByGenres;
    }
    
}