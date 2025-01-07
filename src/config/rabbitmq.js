import amqp from 'amqplib';
import { processWorkshiftMessage } from './workshiftSync.js';

let channel;

async function connectRabbitMQ() {
  if (!channel) {
    try {
      const connection = await amqp.connect(`amqp://${process.env.RABBIT_HOST || 'localhost'}`);
      channel = await connection.createChannel();
      console.log('[RabbitMQ] Connected and channel created');

      // Close connection when the Node.js process ends
      process.on('exit', () => {
        connection.close();
        console.log('[RabbitMQ] Connection closed');
      });

      // Handle connection errors
      connection.on('error', (err) => {
        console.error('[RabbitMQ] Connection error:', err);
        channel = null; // Reset channel so it will be recreated on the next request
      });

      connection.on('close', () => {
        console.log('[RabbitMQ] Connection closed');
        channel = null;
      });
    } catch (error) {
      console.error('[RabbitMQ] Failed to connect to RabbitMQ', error);
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

    // Bind the queue to the exchange
    await channel.bindQueue(queueName, exchangeName, '');
    console.log(`[RabbitMQ] Waiting for messages in queue: ${queueName}`);

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

export { startConsumer };
