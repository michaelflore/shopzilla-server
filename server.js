const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: '.env' });
const fs = require('fs');
const app = require('./app');

const Product = require('./models/product.model');

// Connection URL
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log("Successfully connect to MongoDB.");
})

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database`)
})

// const products = fs.readFileSync(__dirname + '/data/products.json', 'utf-8');

// const importData = async () => {
//     try {
//         await Product.create(JSON.parse(products));

//         console.log('Data loaded') 
//     } catch (e) {
//         console.log(e)
//     }
// }

// if(process.argv[2] === '--import') {
//     importData();
// }

//Server
app.listen(process.env.PORT , function(err) {
    console.log('Server is running')
})