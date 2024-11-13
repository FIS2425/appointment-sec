import amqp from 'amqplib';
import { processWorkshiftMessage } from './workshiftSync.js';

let channel;

async function connectRabbitMQ() {
  if (!channel) {
    try {
      const connection = await amqp.connect(`amqp://${process.env.RABBIT_HOST || 'localhost'}`);
      channel = await connection.createChannel();
      console.log('RabbitMQ connected and channel created');

      // Close connection when the Node.js process ends
      process.on('exit', () => {
        connection.close();
        console.log('RabbitMQ connection closed');
      });

      // Handle connection errors
      connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        channel = null; // Reset channel so it will be recreated on the next request
      });

      connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        channel = null;
      });
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }
  return channel;
}


async function startConsumer() {
  try {
    const channel = await connectRabbitMQ();
    const exchangeName = 'workshiftExchange';
    const queueName = 'appointmentQueue';
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    await channel.assertQueue(queueName, { durable: false });

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, '');
    console.log(`Waiting for messages in ${queueName}...`);

    channel.consume(queueName, (msg) => {
      if (msg !== null) {
        msg.channel = channel;
        processWorkshiftMessage(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error('Error starting consumer:', error);
  }
}


export {startConsumer};