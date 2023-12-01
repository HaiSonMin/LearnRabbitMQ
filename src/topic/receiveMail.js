const amqp = require('amqplib');

const receiveMail = async () => {
  try {
    // 1. Create connect
    const connect = await amqp.connect();

    // 2. Create channel
    const channel = await connect.createChannel();

    // 3. Create exchange
    const nameExchange = 'topicExchange';
    await channel.assertExchange(nameExchange, 'topic', {
      durable: true,
    });

    // 4.Create queue
    const { queue } = await channel.assertQueue('', { exclusive: true });

    // 5.Bidding queue to exchange
    const args = process.argv.slice(2);
    const routerKey = args[0];
    await channel.bindQueue(queue, nameExchange, routerKey);

    /*
     - *.receive: Matching with with "abc.receive", not work with "123.abc.receive" 
     - #.receive: Matching with ending with ".receive"
     */

    // node receiveMail.js "#.receive" -> Apply all ending with ".receive" (EX:123.abc.receive)
    // node receiveMail.js "*.receive" -> user.receive => working,  123.abc.receive => not working
    // node receiveMail.js "*.member.receive" -> Apply only member

    // 6.Consume message in queue
    await channel.consume(
      queue,
      (data) => {
        console.log('data:::', data.fields);
        console.log('RoutingKey:::', data.fields.routingKey);
        console.log('Message:::', data.content.toString());
      },
      { noAck: true }
    );
  } catch (error) {}
};

receiveMail();
