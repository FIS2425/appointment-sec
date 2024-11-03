import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import appointment from './routes/appointmentRoutes.js';
import cookieParser from 'cookie-parser';

const swaggerDocument = YAML.load('./openapi.yaml');

export default function () {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.send('API is running correctly');
  });

  app.use('/appointments', appointment);

  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

  return app;
}
