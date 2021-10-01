const axios = require('axios');

/**
 * Send data to a subscriber
 *
 * @param subscriber {string} name of subscriber e.g. service1
 * @param data {Object} data as received from RabbitMQ
 */
const sendToSubscriber = async (subscriber, data) => {
    const endpoint = getSubscriberEndpoint(subscriber, data.topic);
    console.log('DATAAA:', data);

    return await axios.post(endpoint, {url: "http://mysubscriber.test"});
}

/**
 * Get the endpoint for a service created to process the data fetched
 * from RabbitMQ by this worker
 *
 * @param subscriber {string} name of subscriber e.g. service1
 * @param topic {string} topic as received from RabbitMQ
 * @return {`${string}/${string}`}
 */
const getSubscriberEndpoint = (subscriber, topic) => {
    switch (subscriber) {
        case 'service1':
            return `${process.env.SERVICE1_URL}/${topic}`;
        case 'service2':
            return `${process.env.SERVICE2_URL}/${topic}`;
        default:
            throw new Error(`No URL configured for ${subscriber}`);
    }
}

/**
 * This function is called when a sendToSubscriber request
 * is made. It acknowledges the message fetched from RabbitMQ
 * and logs a success message
 *
 * @param msg the message pulled from RabbitMQ queue
 * @param ch the channel object exposed by the RabbitMQ client
 * @param value value provided by Promise resolve
 */
const handleSuccessRequest = (msg, ch, value) => {
    console.log(`Request successful with status code ${value.status}`);
    // acknowledge message without which data is automatically returned
    // back to queue
    ch.ack(msg);
}

module.exports = {
    sendToSubscriber: sendToSubscriber,
    handleSuccessRequest: handleSuccessRequest
}