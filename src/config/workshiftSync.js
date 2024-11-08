import amqp from 'amqplib/callback_api.js';
import Workshift from '../schemas/Workshift.js';

async function syncWorkshifts() {
  amqp.connect('amqp://rabbitmq', (error0, connection) => {
    if (error0) {
      throw error0;
    }

    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }

      const exchange = 'logs';

      channel.assertExchange(exchange, 'fanout', {
        durable: false
      });

      channel.assertQueue('', {
        exclusive: true
      }, (error2, q) => {
        if (error2) {
          throw error2;
        }

        console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', q.queue);

        channel.bindQueue(q.queue, exchange, '');

        channel.consume(q.queue, (msg) => {
          if (msg.content) {
            const workshiftData = JSON.parse(msg.content.toString());
            handleWorkshiftEvent(workshiftData);
          }
        }, {
          noAck: true
        });
      });
    });
  });
}

async function handleWorkshiftEvent(workshiftData) {
  switch (workshiftData.event) {
  case 'created':
    await createWorkshiftView(workshiftData.data);
    break;
  case 'updated':
    await updateWorkshiftView(workshiftData.data);
    break;
  case 'deleted':
    await deleteWorkshiftView(workshiftData.data);
    break;
  default:
    console.log('Unknown workshift event:', workshiftData.event);
  }
}

async function createWorkshiftView(workshiftData) {
  const workshift = new Workshift(workshiftData);
  await workshift.save();
}

async function updateWorkshiftView(workshiftData) {
  await Workshift.findByIdAndUpdate(workshiftData._id, workshiftData);
}

async function deleteWorkshiftView(workshiftData) {
  await Workshift.findByIdAndDelete(workshiftData._id);
}

export { syncWorkshifts };