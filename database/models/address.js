const database = require('../connections/mongoDb');

// Define schema for address model
const addressSchema = new database.Schema({
    country: String,
    city: String,
    street: String,
    postalCode: String,
    number: Number,
    numberAddition: String,
    status: String,
    name: String,
    // Email should have a unique index, but leaving it nullable means
    // that the field cannot be unique. I'd rather have done
    // email: { type: String, unique: true, required: true } but left it
    // as a nullable String to conform to instructions.
    email: String
});

addressSchema.set('timestamps', true);

module.exports = database.model('Address', addressSchema);
