const express = require("express");

const router = express.Router();
const checkDuplicateUserNameOrEmail = require('../../middleware/auth').checkDuplicateUserNameOrEmail;
const checkRolesExisted  = require('../../middleware/auth').checkRolesExisted;


const signUp  = require('../../controllers/users/authController').signUp;

router.post('/', [checkDuplicateUserNameOrEmail, checkRolesExisted], signUp);


module.exports  = router;
// router.post('/', [checkDuplicateUserNameOrEmail, checkRolesExisted], signIn);
