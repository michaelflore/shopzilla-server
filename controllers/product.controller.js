const Product = require('./../models/product.model');

const fs = require('fs');

const formidable = require('formidable');


exports.productById = async function(req, res, next, id) {
    try {
        const product = await Product.findById(id).populate('owner', '_id name').exec()

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

//Latest products
exports.latestProducts = async function(req, res) {
    try {
        const PAGE_SIZE = 5;
        const page = parseInt(req.query.page);
        const skip = (page - 1) * PAGE_SIZE;
        // const products = await Product.find({}).sort('-created').limit(20).populate('owner', '_id name').skip(skip).limit(PAGE_SIZE)
        const products = await Product.aggregate([
            { 
                "$match" : {}
            },
            { 
                "$sort" : {
                    created: -1
                }
            },
            { 
                "$limit" : 20
            },
            { 
                "$lookup": {
                    "from": "users",
                    "localField": "owner",
                    "foreignField": "_id",
                    "as": "owner"
                }
            },
            {
                "$unwind": '$owner' 
            },
            {
                "$project": {
                    _id: 1,
                    name: 1,
                    description: 1,
                    price: 1,
                    category: 1,
                    quantity: 1,
                    owner: {
                        _id: 1,
                        name: 1
                    }
                }
            },
            {
                "$skip": skip
            },
            {
                "$limit": 5
            }
        ])
console.log(products)
        res.json(products);
    } catch(e) {
        return res.status(400).json({
            error: e.message
        })
    }
}

exports.read = async function(req, res) {
    return res.json(req.product)
}

exports.createProduct = function(req, res) {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if(err) {
            return res.status(400).json({
                message: 'Image could not be uploaded'
            })
        }
        console.log(fields)
        let product = new Product(fields);
        product.owner = req.profile;

        if(files.image) {
            console.log(files.image.path)
            product.image.data = fs.readFileSync(files.image.path)
            product.image.contentType = files.image.type
        }

        try {

            let result = await product.save()
    
            res.json(result);
        } catch(e) {
            return res.status(400).json({
                error: 'Could not create product.'
            })
        }
    })
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

//Images
exports.getImage = (req, res, next) => {
    if(req.product.image.data) {
        res.set("Content-Type", req.product.image.contentType)

        return res.send(req.product.image.data)
    }

    next()
}

exports.defaultImage = (req, res) => {
    // console.log(process.cwd())
    return res.sendFile(__dirname + '/../assets/images/default-product-image.png')
}