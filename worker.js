const env = process.env;
const open = require('amqplib')
    .connect(`amqp://${env.AMQP_USER}:${env.AMQP_PASSWORD}@${env.AMQP_HOST}:${env.AMQP_PORT}`);

module.exports = (queueName, action) => {
    open.then(function(conn) {
        return conn.createChannel();
    }).then(function(ch) {
        return ch.assertQueue(queueName).then(function(ok) {
            return ch.consume(queueName, async function(msg) {
                if (msg !== null) {
                    await action(msg, ch);
                }
            });
        });
    }).catch(console.warn); // should be reported to a monitoring platform such as Sentry or AWS Cloudwatch
}