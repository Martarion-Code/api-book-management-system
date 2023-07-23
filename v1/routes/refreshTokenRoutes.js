const express = require('express');
const { handleRefreshToken } = require('../../controllers/users/authController');

const router = express.Router();

router.get('/', handleRefreshToken);

module.exports = router;