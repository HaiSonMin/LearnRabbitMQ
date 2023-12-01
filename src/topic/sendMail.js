const amqp = require('amqplib');

const sendMail = async ({ msg, routingKey }) => {
  try {
    // 1.Create connect
    const connect = await amqp.connect();

    // 2.Create channel
    const channel = await connect.createChannel();

    // 3.Create exchange
    const nameExchange = 'topicExchange';
    await channel.assertExchange(nameExchange, 'topic', {
      durable: true,
    });

    // 4.Publish message
    console.log('process.argv:::', process.argv.slice(2));

    channel.publish(nameExchange, routingKey, Buffer.from(message));

    setTimeout(() => {
      connect.close();
      process.exit(0);
    }, 2000);
  } catch (error) {}
};

const args = process.argv.slice(2);
const routingKey = args[0];
const message = args[1];
console.log('args:::', args);
console.log('routingKey:::', routingKey);
console.log('message:::', message);

sendMail({ msg: message, routingKey: routingKey });
// node sendMail.js user.receive "You must spend 200.000vnd for upto rank lever"
// node sendMail.js member.receive "You just receive one voucher"
