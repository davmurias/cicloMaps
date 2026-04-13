/**
 * Puerto de Salida (Interface): IRouteRepository
 * Capa: Core / Ports
 * 
 * Define el contrato que cualquier adaptador de persistencia debe cumplir.
 * De esta forma, el dominio no sabe si guardamos en JSON, SQL o una API externa.
 */
export class IRouteRepository {
  /**
   * Obtener todas las rutas guardadas
   * @returns {Promise<Route[]>}
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Guardar una nueva ruta
   * @param {Route} route 
   * @returns {Promise<void>}
   */
  async save(route) {
    throw new Error('Method not implemented');
  }
}
