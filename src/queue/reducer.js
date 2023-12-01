const rabbitMq = require('amqplib');

const ampq__url_docker = 'amqp://localhost:5672';

const reducerQueue = async ({ msg }) => {
  try {
    // 1. Create connect
    const connect = await rabbitMq.connect(ampq__url_docker);

    // 2. Create channel
    const channel = connect.createChannel();

    // 3. Create name queue
    const nameQueue = 'TestQueue';
    (await channel).assertQueue(nameQueue, {
      durable: true, // When server die, queue not lost data
    });

    (await channel).sendToQueue(nameQueue, Buffer.from(msg), {
      // expiration: '10000', // store in 10s (not work with persistent)
      persistent: true, // When server die, queue not lost data(unless consumer get message)
    });

    // (await channel).close();

    //
  } catch (error) {
    console.error('Error:::', error);
  }
};
reducerQueue({ msg: 'Tôi là Sơn nè!' });
