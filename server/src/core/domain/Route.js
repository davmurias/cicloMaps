/**
 * Entidad de Dominio: Route
 * Capa: Core / Domain
 * 
 * Representa una ruta ciclista guardada por el usuario.
 * Es un objeto de valor puro — no tiene dependencias externas ni de frameworks.
 * Esto es el corazón de la Arquitectura Hexagonal: el dominio es independiente.
 */
export class Route {
  /**
   * @param {string} id - UUID único de la ruta
   * @param {string} origin - Dirección de origen
   * @param {string} destination - Dirección de destino
   * @param {string[]} waypoints - Puntos intermedios opcionales
   * @param {string} createdAt - Fecha ISO de creación
   */
  constructor({ id, origin, destination, waypoints = [], createdAt }) {
    this.id = id;
    this.origin = origin;
    this.destination = destination;
    this.waypoints = waypoints;
    this.createdAt = createdAt;
  }

  /**
   * Serializa la entidad a un objeto plano (para persistencia/JSON)
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      origin: this.origin,
      destination: this.destination,
      waypoints: this.waypoints,
      createdAt: this.createdAt,
    };
  }
}
