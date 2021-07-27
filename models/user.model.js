const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    password: {
        type: String,
        required: "Please provide a password"
    },
    created: {
        type: Date,
        default: Date.now
    }

}, { collection: "users" });

//Between getting the data and saving to db
User.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

User.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', User);