# Software Design Document (SDD) & QA Strategy

## 1. Patrones de Diseño y Arquitectura

### 1.1 Sistema Full-Stack Separado
El proyecto se abandonará su formato estático (`mapa_madrid.html`) transicionando a una arquitectura Full-Stack distribuida:
- **Frontend (Cliente):** Aplicación React en Single Page Application (SPA), bundler Vite, alojado en `/client`.
- **Backend (Servidor):** API RESTful en Node.js + Express, alojado en `/server`.

### 1.2 Arquitectura Hexagonal y DTOs (Backend)
El Backend debe implementar obligatoriamente Arquitectura Hexagonal (Ports & Adapters) para aislar la Base de Datos JSON del modelo de negocio.
- **Core (Dominio):** `Route.js` (Entidad).
- **Casos de uso:** `SaveRouteUseCase`, `GetHistoryUseCase`.
- **Puertos:** `IRouteRepository` (Interfases / Contracts).
- **Adaptadores:** `JSONRouteRepository` (Salida), `ExpressController` (Entrada).

### 1.3 Contratos de Validación de Datos
- Las validaciones para el payload de Guardado de Ruta `{ origin, destination, waypoints }` **deben** estar definidas con **Zod** schema.
- Si fallan las aserciones Zod en Backend, se deberá responder exhaustivamente un `HTTP 400 Bad Request` antes de alcanzar el Controlador interno.

### 1.4 Integración y Gobierno (Git & MCP GitHub)
Todos los desarrollos son gobernados bajo "Pull Request Driven Development (PRDD)" para humanos y agentes asíncronos. 
- Ningún agente tiene permitido hacer comandos `push` indiscriminados hacia `main`.
- El Orquestador generará ramas, levantará Pull Requests, y el QA Reviewer utilizará directamente la tecnología de MCP Server para comentar bloqueos línea a línea en el Pull Request.

### 1.5 Estrategia de Enrutamiento Geospacial (GIS Routing)
La aplicación asume dos modos de operación excluyentes en cuanto a topología de cálculo:
- **Opción B (Primary Production Mode):** Se instanciará un motor cartográfico interno (ej: `pgRouting` dentro de un contendor PostgreSQL via Docker + VPS). El contenedor debe parsear el GeoJSON municipal internamente y forzar el enrutamiento matemático a través de las vías ciclo-inclusivas estrictamente bajo Arquitectura Privada, evitando el snapping erróneo hacia carreteras de tráfico pesado.
- **Opción A (Public Fallback Mode):** En caso de caída de memoria o despliegue inicial limitado, el sistema mantendrá activa su delegación de cálculo cartográfico a la API pública OSRM Bicycle Profile. Esta opción es resiliente pero tolerará "desvíos topológicos" si la vía peatonal/ciclista no figura registrada con estricto permiso de bicicleta en OpenStreetMap originario.

---

## 2. Observabilidad, Trazabilidad e Inteligencia (O&T)

Para asegurar monitoreo ágil en producción:
- **Logging Estructurado:** Prohibido el uso de `console.log`. Se usará `pino.js` o `winston` emitiendo logs en formato JSON.
- **Trazabilidad de Peticiones:** Todo HTTP Request que viaja desde el Frontend React debe incluir un `UUIDv4` bajo la cabecera (header) `x-correlation-id`.
- El Backend inyectará este UUID en cada línea de log generada (validación, guardado) para permitir trazabilidad distribuida e investigación de bugs en cadena.

---

## 3. Pirámide de Pruebas (Test Pyramid) y TDD

Los agentes desarrolladores operarán exclusivamente en modalidad *Test-Driven Development (TDD)*: 

1. **Unit Testing (~70%)**: (Vía `Vitest` o `Jest`).
   - Hooks de React aislados, componentes puros, validadores Zod, Entidades Hexagonales Backend que no requieran dependencias externas.
2. **Integration Testing (~20%)**: (Vía `Supertest`).
   - Mockeo del JSONRepository. Lanzar Express en entorno de Node para probar que `/api/routes` escribe en el adaptador Outbound correctamente mediante un objeto de petición HTTP mockeado.
3. **End-to-End Testing Visual (Computer Vision con Playwright)**: (~10%).
   - Test global integrando ambas partes. Simulando entorno en la red local.
   - Las pruebas Playwright estipuladas sacarán *screeshots* de la aplicación en modo Headless. Éstas pasarán inmediatamente al QA Reviewer que verificará de manera visual-semántica que propiedades tan arbitrarias como los reflejos del diseño Glassmorphism se mantienen inalcanzables a bugs técnicos que Vitest no puede cazar.

### 4. Cobertura de Código Extrema (Coverage)

Se establece un muro de paso del **80% de Test Coverage**:
- Todo módulo o Pull Request gestionado por los Agentes será sujeto al escaneo por `c8` / `nyc istanbul`.
- Métrica requerida: `>80% Statements, >80% Branches, >80% Lines`.
- Ningún Orquestador debe aprobar código de agentes especializados que carezca de Unit Tests con estas métricas documentadas y comprobables en `npm run test:coverage`.

---
## 5. Memoria Episódica Compartida (Knowledge Graphs)
Para eliminar los bucles infinitos en errores repetidos, se integra una base de datos vectorial de "Experiencia del Proyecto" usando *MCP Memory*.
- Cada vez que el QA Reviewer genere una "Critique" significativa que destape un mal patrón del agente trabajador, el Orquestador la almacenará en un nodo de memoria en el subconsciente de la IA.
- Los agentes buscarán proactivamente si un error en consola ha sucedido anteriormente a algún predecesor y si hay una recomendación almacenada antes de improvisar código basura repetitivo.

---

## 6. Funcionalidades de la Interfaz (UI/UX) y Mapa Interactivo

Para evolucionar la experiencia del usuario, la aplicación desarrollará las siguientes funcionalidades clave:

### 6.1 Cálculo y Visualización de Rutas
- **Puntos de Origen y Destino:** El frontend dispondrá de controles en el panel de navegación para que el usuario identifique o busque un punto de inicio y un destino.
- **Trazado en Mapa:** El sistema deberá integrarse con un servicio (ej. Directions Service) para calcular la ruta entre ambos puntos y pintarla (renderizarla) en el mapa directamente para el usuario.

### 6.2 Almacenamiento y Recuperación de Historial
- **Guardado de Rutas:** Como extensión al caso de uso existente (`SaveRouteUseCase`), el sistema ofrecerá un mecanismo visible para guardar la ruta actual.
- **Rescate Interactivo:** En la interfaz se representará una lista (Historial) que permita recuperar rutas anteriores, de forma que al pulsar sobre ellas el punto de origen y destino vuelvan a cargarse y representarse en el mapa.

### 6.3 Gestión y Filtrado de la Red Ciclista (Capas)
- **Ocultación/Muestra por Capas:** Ya que la red consta de distintas tipologías (Anillo Verde, Carril Bici Seguro, Ciclocarril, etc.), el usuario dispondrá de controles (checkboxes/toggles) en una interfaz tipo Leyenda/Filtros.
- **Acción Dinámica:** Al activar/desactivar estos filtros, el frontend manipulará dinámicamente los estilos visuales del set de datos (`GeoJSON Data Layer`) en el instante, ocultando o volviendo a mostrar las vías en función de la elección del filtro.

### 6.4 Puntos Intermedios Interactivos (Waypoints) mediante Ratón
- **Interacción Manual:** El usuario podrá añadir puntos intermedios (waypoints) a la ruta ciclista calculada, haciendo click directamente con el ratón sobre el mapa.
- **Inyección por Proximidad:** Si la ruta base (Origen - Destino) ya existe o si ya constan varios puntos intermedios generados, el sistema deberá computar la nueva inyección calculando el segmento algorítmico más lógico, creando el nuevo waypoint *entre* los dos puntos perimetrales más cercanos a la coordenada señalada.
- **Micro-gestión:** Los "endpoints" intermedios renderizados soportarán eventos reactivos para poder ser eliminados individualmente con click o control auxiliar (ej. click derecho), recalculando inmediatamente la ruta sobre el rastro superviviente.
