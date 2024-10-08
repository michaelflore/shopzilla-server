let express = require('express');

let productController = require('./../controllers/product.controller');
let userController = require('./../controllers/user.controller');

let router = express.Router();

//List all product categories
router.route('/api/products/categories')
  .get(productController.listCategories)

//List products by their owner
//Create product
router.route('/api/products/by/:userId')
  .get(productController.listProductsByOwner)
  .post(productController.createProduct)

//Delete a product
router.route('/api/products/by/:userId/:productId')
  .delete(productController.deleteProduct)

// Read an individual product for individual view
router.route('/api/products/:productId')
    .get(productController.read)

//List all products 
//sort
//by category
router.route('/api/products')
  .get(productController.listAllProducts)

//List latest
router.route('/api/latest')
  .get(productController.latestProducts)

//Product image
router.route('/api/product/image/:productId')
    .get(productController.getImage, productController.defaultImage)
router.route('/api/product/defaultphoto')
    .get(productController.defaultImage)


router.param('userId', userController.userById)
router.param('productId', productController.productById)

module.exports = router;
