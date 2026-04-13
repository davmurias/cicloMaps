import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../db/routes.json');
const dbDir = path.join(__dirname, '../../db');

describe('API Routes Integration Tests', () => {
  beforeAll(async () => {
    // Asegurar que el directorio db existe
    await mkdir(dbDir, { recursive: true });
    // Limpiar base de datos de test
    await writeFile(dbPath, JSON.stringify([]));
  });

  describe('GET /api/routes', () => {
    it('debería devolver un array vacío inicialmente', async () => {
      const response = await request(app).get('/api/routes');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('debería incluir la cabecera x-correlation-id', async () => {
      const response = await request(app).get('/api/routes');
      expect(response.headers['x-correlation-id']).toBeDefined();
    });
  });

  describe('POST /api/routes', () => {
    it('debería guardar una ruta válida y devolver 201', async () => {
      const newRoute = {
        origin: 'Madrid Centro',
        destination: 'Anillo Verde',
        waypoints: ['Casa de Campo']
      };

      const response = await request(app)
        .post('/api/routes')
        .send(newRoute);

      expect(response.status).toBe(201);
      expect(response.body.origin).toBe(newRoute.origin);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
    });

    it('debería fallar con 400 si faltan campos obligatorios (Zod validation)', async () => {
      const invalidRoute = {
        origin: 'Sólo tengo origen'
      };

      const response = await request(app)
        .post('/api/routes')
        .send(invalidRoute);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validación fallida');
    });
  });
});
