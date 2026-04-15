import express from 'express';
import cors from 'cors';
import { pino } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

// Domain/Application/Adapters
import { JSONRouteRepository } from './adapters/outbound/JSONRouteRepository.js';
import { GetHistoryUseCase } from './core/application/GetHistoryUseCase.js';
import { SaveRouteUseCase } from './core/application/SaveRouteUseCase.js';
import { RoutesController } from './adapters/inbound/RoutesController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = pino();

const app = express();
const port = process.env.PORT || 3999;

// Middlewares
app.use(cors());
app.use(express.json());

// Trazabilidad y Logging (SDD 2.0)
app.use((req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || uuidv4();
  req.correlationId = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  req.log = logger.child({ correlationId });
  req.log.info({ method: req.method, url: req.url }, 'Petición recibida');
  next();
});

// Inyección de Dependencias (Manual para evitar frameworks DI complejos)
const dbPath = path.join(__dirname, '../db/routes.json');
const repository = new JSONRouteRepository(dbPath);
const getHistoryUC = new GetHistoryUseCase(repository);
const saveRouteUC = new SaveRouteUseCase(repository);
const controller = new RoutesController(getHistoryUC, saveRouteUC);

// Rutas
app.get('/', (req, res) => res.send('Backend Activo v2 - GeoJSON Ready'));
app.get('/api/routes', (req, res) => controller.getHistory(req, res));
app.post('/api/routes', (req, res) => controller.saveRoute(req, res));

// Endpoint para servir el GeoJSON de la red ciclista
app.get('/api/geojson', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../rutas_ciclistas_madrid.json'));
});

// Error handling
app.use((err, req, res, next) => {
  req.log.error(err);
  res.status(500).json({ error: 'Fallo interno del servidor' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Servidor backend corriendo en http://localhost:${port}`);
  });
}

export default app;
