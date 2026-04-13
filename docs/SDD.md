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

