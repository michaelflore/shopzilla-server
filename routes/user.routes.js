let express = require('express');

let userController = require('./../controllers/user.controller');

let router = express.Router();

//Get specific user
router.route('/api/users/:userId')
  .get(userController.getUser)
  .delete(userController.deleteUser)

//Get all users
router.route('/api/users')
  .get(userController.getAllUsers)

router.param('userId', userController.userById);

module.exports = router;
