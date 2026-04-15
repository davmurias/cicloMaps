# Lista de Tareas (Funcionalidades UI/UX - SDD v6.0)

El siguiente documento actúa como Backlog de producto para hacer el seguimiento de las funcionalidades de la Sección 6 del SDD.

## Funcionalidades Ya Realizadas (Core Base)
- [x] Transición de formato estático a Full-Stack (`/client` y `/server`).
- [x] Backend: Implementación de Arquitectura Hexagonal y DTOs (Dominio, Casos de Uso, Puertos y Adaptadores).
- [x] API: Mockeada la base de datos JSON y servidos `endpoints` para `/api/routes` y `/api/geojson`.
- [x] Validación Backend: Contratos de datos estructurados para rutas con **Zod** y correlación UUID.
- [x] Proxy: Configurado proxy de Vite para evadir fallos de CORS durante el development.
- [x] Carga Base del UI: Entorno inicial de React con Glassmorphism (`Dashboard.jsx`, `InfoPanel.jsx`, `RoutingPanel.jsx`).
- [x] Mapa Base Integrado: SDK `@react-google-maps/api` interactuando y renderizando el archivo GeoJSON local correctamente sin errores.

## Funcionalidades Por Crear (WIP)

- [x] **6.1 Cálculo y Visualización de Rutas:**
  - [x] Añadir controles de origen/destino reales en `RoutingPanel.jsx`.
  - [x] Integrarse con el servicio de rutas de Google Maps (Directions Service).
  - [x] Renderizar el trazado resultante directamente sobre el plano.

- [x] **6.2 Almacenamiento y Recuperación de Historial:**
  - [x] Conectar el resultado de la ruta con la llamada POST a `/api/routes`.
  - [x] Crear el panel lateral o modal que cargue el `history` del backend.
  - [x] Añadir función "onclick" en el historial para redibujar la ruta pasada.

- [x] **6.3 Gestión y Filtrado de Capas:**
  - [x] Crear checkboxes o toggles en `Dashboard.jsx` (Leyenda).
  - [x] Crear el mecanismo de filtrado para manipular los estilos geoespaciales del `google.maps.Data` en tiempo real basándose en las keywords.

- [x] **6.4 Puntos Intermedios Interactivos (Waypoints):**
  - [x] Capturar eventos de click en el mapa (o en la polilínea) para designar una nueva coordenada intermedia.
  - [x] Calcular matemáticamente la posición lógica (cálculo de proximidad a otros puntos) para reordenar la caja de *waypoints*.
  - [x] Proveer método visual (click derecho o botón de eliminar en panel) para destruir los waypoints individualmente y recalcular la ruta.

## Fase 7: DevOps, Seguridad y Escalado (Opción B)

- [ ] **7.1 Infraestructura Local (Dockerización base):**
  - [ ] Crear variables de entorno (`.env`) aislando Google Maps API Key y demás secretos en Front y Back.
  - [ ] Crear el `Dockerfile` de Node.js (Servidor) y el `Dockerfile` multistage para React.
  - [ ] Proveer un `docker-compose.yml` unificador.

- [ ] **7.2 Backend: Proxying, Caché y Monorepo:**
  - [ ] Desplegar un proxy local en Express `/api/routing` para evitar llamadas directas a Nominatim (CORS) y absorber Rate Limiting.
  - [ ] Extraer esquemas *Zod* a un sub-módulo accesible por cliente y servidor (Monorepo Compartido).
  - [ ] Implementar middleware de rate-limiting (OWASP).

- [ ] **7.3 Migración Geospacial (Opción B PostGIS):**
  - [ ] Escalar backend instalando librería pg/TypeORM o equivalente, e inyectando un contenedor `postgis`.
  - [ ] Aplicar módulo de encriptamiento/insercción de nuestro propio GeoJSON dentro de la BBDD local.
  - [ ] Sustituir lógica OSRM pública para permitir cálculo directo sobre Grafos Locales.

- [ ] **7.4 Feature Funcional: Exportación:**
  - [ ] Habilitar exportación de la topología final (`.gpx`) al ciclista.

- [ ] **7.5 UI/UX y A11Y Audit:**
  - [ ] Someter SPA a análisis bajo preceptos A11Y (contrastes, tabulación, aria-labels).
  - [ ] Ajustes Glassmorphism definitivos adaptados a Bottom Sheet en *mobile view*.
