const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './.env' });

const app = require('./app');

// Connection URL
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://michael:' + process.env.PASSWORD + '@cluster0.kuznd.mongodb.net/' + process.env.PROJECT_NAME +'?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log("Successfully connect to MongoDB.");
})

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database`)
})

app.listen(process.env.PORT , function(err) {
    console.log('Server is running')
})