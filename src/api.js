import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import appointment from './routes/appointmentRoutes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { startConsumer } from './config/rabbitmq.js';
import logger from './config/logger.js';
import KafkaTransport from './utils/kafkaTransport.js';

const swaggerDocument = YAML.load('./openapi.yaml');

export default function () {
  if (process.env.NODE_ENV !== 'test') {
    startConsumer();
  }
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }))

  app.get('/', (req, res) => {
    res.send('API is running correctly');
  });

  app.get(`${process.env.API_PREFIX || ''}/healthz`, (req, res) => {
    res.status(200).send('API is healthy');
  });

  app.use(`${process.env.API_PREFIX || ''}/appointments`, appointment);

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
}

async function shutdown() {
  console.log('Shutting down the application...');

  if (process.env.NODE_ENV === 'production') {
    try {
      for (const transport of logger.transports) {
        if (transport instanceof KafkaTransport) {
          await transport.close();
          console.log('Kafka producer disconnected');
        }
      }
    } catch (error) {
      console.error('Error disconnecting Kafka producer:', error);
    }
  }

  console.log('HTTP server closed');
  process.exit(0);
}

process.on('SIGINT', async () => {
  console.log('SIGINT received');
  await shutdown();
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await shutdown();
});

process.on('uncaughtException', async (error) => {
  console.error('Uncaught exception:', error);
  await shutdown();
});

process.on('unhandledRejection', async (reason) => {
  console.error('Unhandled promise rejection:', reason);
  await shutdown();
});
