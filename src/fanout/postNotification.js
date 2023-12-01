const amqp = require('amqplib');

const ampq__url_docker = 'amqp://localhost:5672';
// Producer will be send message for all exchange
// Exchange will be send message from producer for all queue
// Queue will be send message for all consumer
const postNotification = async ({ msg }) => {
  try {
    // 1. Create connect
    const connect = await amqp.connect(ampq__url_docker);

    // 2. Create channel
    const channel = await connect.createChannel();

    // 3. Create exchange
    const nameExchange = 'fanoutExchange';
    await channel.assertExchange(nameExchange, 'fanout', {
      durable: true,
    });

    channel.publish(nameExchange, '', Buffer.from(msg));

    console.log('Exchange send success::::', msg);

    setTimeout(() => {
      connect.close();
      process.exit(0);
    }, 2000);
  } catch (error) {
    console.log(error);
  }
};

postNotification({ msg: 'Hải Sơn nè, tao mới ra video á' });
