const User = require('./../models/user.model');
const jwt = require('jsonwebtoken');

exports.signup = async function(req, res) {
    try {
        const newUser = new User(req.body);

        await newUser.save();

        res.status(200).json({
            message: 'Successfully signed up'
        })
    } catch(e) {
        return res.status(400).json({
            error: 'Could not sign up user.'
        })
    }
}

exports.signin = async function(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ "email": email });

        if (!user) {
            return res.status('401').json({ error: "User not found" })
        }

        const correct = user.correctPassword(password, user.password);

        if(!correct) {
            return res.status('401').json({ error: "Incorrect Password" })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET );

        res.cookie("t", token, {
            expire: new Date() + 9999
        })

        res.status(200).json({
            message: 'Successfully signed in',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch(e) {
        return res.status(400).json({
            error: e.message
        })
    }
}

exports.signout = function(req, res) {
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}