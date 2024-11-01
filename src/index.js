import express from 'express';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import appointment from './routes/appointmentRoutes.js';
import { connectDB } from './config/database.js';

const swaggerDocument = YAML.load('./openapi.yaml');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use('/appointments', appointment);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();