const rabbitMq = require('amqplib');

const ampq__url_docker = 'amqp://localhost:5672';

const consumerQueue = async () => {
  try {
    // 1. Create connect
    const connect = await rabbitMq.connect(ampq__url_docker);

    // 2. Create channel
    const channel = connect.createChannel();

    // 3. Create name queue
    const nameQueue = 'TestQueue';
    (await channel).assertQueue(nameQueue, {
      durable: true,
    });

    (await channel).consume(
      nameQueue,
      (data) => console.log(data.content.toString()),
      {
        noAck: true, // confirm has receive message (Nếu là false thì là tin nhắn chưa được xử lí, nó vẫn sẽ được gửi nếu có consumer vào hàng đợi và lấy tin nhắn)
      }
    );

    // (await channel).close();

    //
  } catch (error) {
    console.error('Error:::', error);
  }
};
consumerQueue();
