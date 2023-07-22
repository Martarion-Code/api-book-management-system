const express = require('express');
const bookController = require('../../controllers/bookController');
const verifyJWT = require('../../middleware/auth').verifyJWT;
const router =express.Router();


router.get('/', bookController.getAllBooks );
// router.get('/bookbygenres', [verifyJWT] , bookController.getBooksByGenres );

module.exports = router;

