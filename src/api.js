import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import appointment from './routes/appointmentRoutes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { startConsumer } from './config/rabbitmq.js';

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

  app.get(`${process.env.API_PREFIX || ''}/health`, (req, res) => {
    res.status(200).send('API is healthy');
  });

  app.use(`${process.env.API_PREFIX || ''}/appointments`, appointment);

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
}
