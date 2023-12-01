const amqp = require('amqplib');
const receiveMail = async () => {
  try {
    // 1.Create connect
    const connect = await amqp.connect();
    // 2.Create channel
    const channel = await connect.createChannel();
    // 3.Create exchange
    const nameExchange = 'directExchange';
    await channel.assertExchange(nameExchange, 'direct', { durable: true });
    // 4.Create queue
    const { queue } = await channel.assertQueue('', { exclusive: true });
    // 5.Bidding queue to exchange
    const args = process.argv.slice(2);
    const routerKey = args[0];
    await channel.bindQueue(queue, nameExchange, routerKey); // Not using pattern is * or #
    // 6.Consumer
    await channel.consume(queue, (data) => {
      console.log(data.fields.routingKey);
      console.log(data.content.toString());
    });
  } catch (error) {
    console.log(error);
  }
};

receiveMail();
