const Book = require('../models').Book;
const bookService = require('../services/bookService');



module.exports = {
    async getAllBooks(req, res){
        const allBooks = await bookService.getAllBooks();
        return res.send({status: 200, data: allBooks});
    },
    getBooksByGenres(req, res){
        const genres = req.body.genres;
        const booksByGenres = bookService.getBooksByGenre(genres);
        return res.send({status: 200, data: booksByGenres});
    }
}