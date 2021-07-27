const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: 'Category is required'
    },
    price: {
        type: Number,
        required: "Price is required"
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { collection: "products" })

module.exports = mongoose.model('Product', Product);