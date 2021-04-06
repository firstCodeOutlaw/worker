const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const addresses = require('./routes/addresses');
const app = express();
const port = process.env.PORT;

// Accept only json requests
app.use(express.json({ type: 'application/json' }));
// Use helmet to secure app using HTTP headers
app.use(helmet());
// Load routes for addresses
app.use('/address', addresses);

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
});
