/**
 * Caso de Uso: GetHistoryUseCase
 * Capa: Core / Application
 * 
 * Recupera el historial completo de rutas guardadas.
 */
export class GetHistoryUseCase {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async execute() {
    return await this.routeRepository.findAll();
  }
}
