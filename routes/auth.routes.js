let express = require('express');

let authController = require('./../controllers/auth.controller');

let router = express.Router();

router.route('/signin')
    .post(authController.signin)

router.route('/signup')
    .post(authController.signup)

router.route('/signout')
    .get(authController.signout)

module.exports = router;