const Book = require("../models").Book;
const Genre = require("../models").Genre;


module.exports = {
  async getAllBooks() {
    const allBooks = await Book.findAll({
      limit:20,include: [], raw:true});
    // console.log(allBooks);
    return allBooks; 
  },
  async  getBooksByGenre(genres){
    const selectedGenres = await Genre.findAll({
      where:{
        name: genres
      }
    })

    const selectedGenreIds = selectedGenres.map(genre => genre.id);

    const booksByGenres = await Book.findAll({
      include: [
        {
          model: Genre,
          where: {
            id:selectedGenreIds,
          },
          through: {
            attributes: []
          },
        },
      ],
    });

    return  booksByGenres;
  }

  };
