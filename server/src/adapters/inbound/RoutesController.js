import { z } from 'zod';

/**
 * Adaptador de Entrada: RoutesController
 * Capa: Adapters / Inbound
 * 
 * Gestiona las peticiones HTTP y delega en los casos de uso.
 * Implementa la validación Zod y el manejo de errores conforme al SDD.
 */
export class RoutesController {
  constructor(getHistoryUseCase, saveRouteUseCase) {
    this.getHistoryUseCase = getHistoryUseCase;
    this.saveRouteUseCase = saveRouteUseCase;
  }

  /**
   * Obtener historial de rutas
   */
  async getHistory(req, res) {
    try {
      const routes = await this.getHistoryUseCase.execute();
      res.json(routes);
    } catch (error) {
      req.log.error(error);
      res.status(500).json({ error: 'Error al recuperar el historial' });
    }
  }

  /**
   * Guardar una nueva ruta
   */
  async saveRoute(req, res) {
    try {
      // 1. Validación Zod (Paso 1.3 del SDD)
      const routeSchema = z.object({
        origin: z.string().min(1),
        destination: z.string().min(1),
        waypoints: z.array(z.string()).optional(),
      });

      const validation = routeSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          error: 'Validación fallida',
          details: validation.error.errors
        });
      }

      // 2. Ejecución del caso de uso
      const route = await this.saveRouteUseCase.execute(validation.data);
      
      res.status(201).json(route);
    } catch (error) {
      req.log.error(error);
      res.status(500).json({ error: 'Error al guardar la ruta' });
    }
  }
}
