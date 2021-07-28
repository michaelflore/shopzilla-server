const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const app = require('./app');

// Connection URL
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log("Successfully connect to MongoDB.");
})

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database`)
})

//Server
app.listen(process.env.PORT , function(err) {
    console.log('Server is running')
})