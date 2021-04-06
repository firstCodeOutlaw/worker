const mongoose = require('mongoose');

const password = encodeURIComponent(process.env.DB_PASSWORD);
const databaseUser = process.env.DB_USER;
const database = process.env.DB_NAME;
const connectionString = `mongodb+srv://${databaseUser}:${password}@cluster0.n6b8l.mongodb.net/${database}`;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.error('Failed to connect to MongoDB...', error));

module.exports = mongoose;
