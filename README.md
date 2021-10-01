## Worker
This worker is created to get data from a RabbitMQ messaging queue and send it
to the appropriate services via HTTP

## Installation
Before running this application, ensure that you have [Publisher](https://github.com/firstCodeOutlaw/publisher)
(a Laravel application) setup and running.
- After cloning, `cd` into application directory and run `npm install` to install dependencies
- Run `npm start` to start the application. You might need to use [PM2](https://pm2.keymetrics.io/) 
to keep it running as a background process even if you close your terminal.
