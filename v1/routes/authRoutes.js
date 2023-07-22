const express = require("express");

const router = express.Router();

const checkDuplicateUserNameOrEmail = require('../../middleware/auth').checkDuplicateUserNameOrEmail;
const checkRolesExisted  = require('../../middleware/auth').checkRolesExisted;
const signIn  = require('../../controllers/users/authController').signIn;
// const signUp  = require('../../controllers/users/authController').signUp;

router.post('/',  signIn);

// router.post('/', [checkDuplicateUserNameOrEmail, checkRolesExisted], signIn);
module.exports  = router;
