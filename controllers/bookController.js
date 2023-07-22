const Book = require('../models').Book;
const bookService = require('../services/bookService');



module.exports = {
    getAllBooks(req, res){
        const allBooks = bookService.getAllBooks();
        return res.send({status: 200, data: allBooks});
    }
}