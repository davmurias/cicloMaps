import { Route } from '../domain/Route.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de Uso: SaveRouteUseCase
 * Capa: Core / Application
 * 
 * Orquestador de la lógica para guardar una nueva ruta.
 */
export class SaveRouteUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute({ origin, destination, waypoints }) {
    const route = new Route({
      id: uuidv4(),
      origin,
      destination,
      waypoints,
      createdAt: new Date().toISOString(),
    });

    await this.routeRepository.save(route);
    return route;
  }
}
