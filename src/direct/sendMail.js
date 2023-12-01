const amqp = require('amqplib');
const sendMail = async ({ msg, routingKey }) => {
  try {
    // 1.Create connect
    const connect = await amqp.connect();
    // 2.Create channel
    const channel = await connect.createChannel();
    // 3.Create exchange
    const nameExchange = 'directExchange';
    await channel.assertExchange(nameExchange, 'direct', { durable: true });
    // 4.Publish message
    channel.publish(nameExchange, routingKey, Buffer.from(msg));

    setTimeout(() => {
      channel.close();
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.log(error);
  }
};

const args = process.argv.slice(2);
const routingKey = args[0];
const message = args[1];
sendMail({ msg: message, routingKey: routingKey });
