const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const startWorker = require('./worker');
const { sendToSubscriber, handleSuccessRequest} = require("./lib/request");

// Accept only json requests
app.use(express.json({ type: 'application/json' }));

// Use helmet to secure index using HTTP headers
app.use(helmet());

// Parse application/json
app.use(bodyParser.json());

// Run worker
startWorker('notifications', async (msg, ch) => {
    const data = JSON.parse(msg.content);

    switch (data.topic) {
        case 'topic1':
            // route request to service 1
            return await sendToSubscriber('service1', data).then(
                (value) => handleSuccessRequest(msg, ch, value),
                (error) => console.log(error.message)
            );
        case 'topic2':
            // route request to service 2
            return await sendToSubscriber('service2', data).then(
                (value) => handleSuccessRequest(msg, ch, value),
                (error) => console.log(error.message)
            );
        default:
            throw new Error(`${data.topic} topic does not match a known service`)
    }
});

// Start HTTP server
app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`)
});
