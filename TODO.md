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
