import { readFile, writeFile } from 'fs/promises';
import { Route } from '../../core/domain/Route.js';
import { IRouteRepository } from '../../core/ports/IRouteRepository.js';

/**
 * Adaptador de Salida: JSONRouteRepository
 * Capa: Adapters / Outbound
 * 
 * Implementación concreta del repositorio para persistencia en sistema de archivos local.
 */
export class JSONRouteRepository extends IRouteRepository {
  constructor(dbPath) {
    super();
    this.dbPath = dbPath;
  }

  /**
   * Lee el fichero JSON y lo mapea a entidades Route
   */
  async findAll() {
    try {
      const data = await readFile(this.dbPath, 'utf8');
      const routes = JSON.parse(data);
      return routes.map(r => new Route(r));
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  /**
   * Guarda una nueva ruta en el fichero JSON
   */
  async save(route) {
    const routes = await this.findAll();
    routes.push(route.toJSON());
    await writeFile(this.dbPath, JSON.stringify(routes, null, 2), 'utf8');
  }
}
