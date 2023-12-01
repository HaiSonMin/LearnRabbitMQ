const amqp = require('amqplib');

const ampq__url_docker = 'amqp://localhost:5672';
// Producer will be send message for all exchange
// Exchange will be send message from producer for all queue
// Queue will be send message for all consumer
const receiveNotification = async () => {
  try {
    // 1.Create connect
    const connect = await amqp.connect(ampq__url_docker);

    // 2.Create channel
    const channel = await connect.createChannel();

    // 3.Create exchange
    const nameExchange = 'fanoutExchange';
    await channel.assertExchange(nameExchange, 'fanout', {
      durable: true,
    });

    // 4.Create queue
    const { queue } = await channel.assertQueue('queue1', {
      exclusive: true, //Auto remove queue if not subscriber
    });

    console.log('Name queue:::', queue);

    // 5.Binding
    await channel.bindQueue(queue, nameExchange, "");

    // 6.Consumer
    await channel.consume(
      queue,
      (data) => console.log(data.content.toString()),
      { noAck: true } // confirm has receive message (Nếu là false thì là tin nhắn chưa được xử lí, nó vẫn sẽ được gửi nếu có consumer vào hàng đợi và lấy tin nhắn)
    );
  } catch (error) {
    console.log(error);
  }
};

receiveNotification();
