const Product = require('./../models/product.model');

exports.productById = async function(req, res, next, id) {
    try {
        const product = await Product.findById(id) 

        if(!product) {
            return res.status('400').json({
                error: "Product not found"
            })
        }

        req.product = product
        next()
    } catch(e) {
        return res.status(400).json({
            error: 'Could not find product by id'
        })
    }
}

exports.listCategories = async function(req, res) {
    try {
        const categories = await Product.distinct('category', {});

        res.json(categories);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not fetch the categories.'
        })
    }
}

exports.listProductsByCategory = async function(req, res) {
    try {
        const products = await Product.find({ category: req.query.category }).populate('owner', '_id name')

        res.json(products);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not fetch products by category.'
        })
    }
}

exports.listProductsByOwner = async function(req, res) {
    try {
        const products = await Product.find({ owner: req.profile._id }).populate('owner', '_id name');

        res.json(products);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not fetch products by owner.'
        })
    }
}

exports.createProduct = async function(req, res) {
    try {
        const product = new Product(req.body)
        product.owner = req.profile

        let result = await product.save()

        res.json(result);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not create product.'
        })
    }
}

exports.deleteProduct = async function(req, res) {
    try {
        const product = req.product;

        let result = await product.remove()

        res.json(result);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not delete product.'
        })
    }
}