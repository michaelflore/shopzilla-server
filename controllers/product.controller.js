const Product = require('./../models/product.model');
const User = require('./../models/user.model');
const mongoose = require('mongoose');

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

exports.listAllProducts = async function(req, res) {
    try {
        // console.log(req.query)
        let query = {}, sort = {};

        if(req.query.category && req.query.category != "All") {
            query.category = req.query.category
        }

        if(req.query.seller) {
            query.owner = req.query.seller
        }

        if(req.query.max_price || req.query.min_price) {
            query.price = { $lte: req.query.max_price || 1000000000, $gte: req.query.min_price || 0 }
        }
        
        if(req.query.sort) {
            if(req.query.sort == "price_low") {
                sort = { price: 1 }
            } else if(req.query.sort == "price_high"){
                sort = { price: -1 }
            } else {
                sort = {};
            }
        }

        const products = await Product.find(query).sort(sort).populate('owner', '_id name')

        res.json(products);
    } catch(e) {
        return res.status(400).json({
            error: e.message
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