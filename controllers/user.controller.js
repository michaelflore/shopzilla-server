const User = require('./../models/user.model');
const Product = require('./../models/product.model');

exports.userById = async function(req, res, next, id) {
    try {
        const user = await User.findById(id);
        req.profile = user

        next();
    } catch(e) {
        return res.status(400).json({
            error: 'Could not get user.'
        })
    }
}

exports.getAllUsers = async function(req, res) {
    try {
        const users = await User.find({});

        res.json(users);
    } catch(e) {
        return res.status(400).json({
            error: 'Could not get all users.'
        })
    }
}

exports.getUser = function(req, res) {
    return res.json(req.profile)
}

exports.deleteUser = async function(req, res) {
    try {
        const user = req.profile;

        await Product.deleteMany({ owner: user._id });

        let deletedUser = await user.remove();

        res.json(deletedUser)
    } catch(e) {
        return res.status(400).json({
            error: e.message
        })
    }
}