# 🚲 Proyecto Ciclista Madrid - Arquitectura Full-Stack

Este documento sirve como bitácora de la migración del proyecto desde un prototipo estático a una aplicación profesional distribuida.

## 🏛️ Decisiones de Arquitectura

### Backend (Node.js + Express)
Se ha implementado **Arquitectura Hexagonal** para asegurar que la lógica de negocio esté desacoplada de la infraestructura (servidor, base de datos).
- **Core (Dominio/Aplicación)**: Contiene las entidades (`Route.js`) y casos de uso.
- **Adapters**: Conexiones externas. `JSONRouteRepository` para persistencia y `RoutesController` para HTTP.
- **TDD (Vitest)**: No se acepta código sin tests. Cobertura actual: **92%**.
- **Zod**: Validación estricta de esquemas de datos.

### Frontend (React + Vite)
Migrado para soportar una UI reactiva y componentes reutilizables.
- **Glassmorphism**: UI basada en capas translúcidas, desenfoque de fondo y bordes brillantes.
- **Google Maps Interaction**: Integración con la API vectorial para visualización de GeoJSON.
- **Separación de Concernimientos**: Componentes puros (`Dashboard`, `InfoPanel`) vs Componentes con lógica (`MapContainer`, `RoutingPanel`).

## 🛠️ Guía de Ejecución

### Requisitos
- Node.js v20+
- pnpm (instalado en el sistema)

### Servidor (API)
1. Navega a `server/`
2. Ejecuta `node src/app.js`
3. La API estará disponible en `http://localhost:3001`

### Cliente (Web)
1. Navega a `client/`
2. Ejecuta `pnpm dev`
3. Abre `http://localhost:5173`

## 🧠 Aprendizaje para el Humano
- **Inyección de Dependencias**: Observa cómo `app.js` instancia el repositorio y lo pasa a los casos de uso. Esto permite cambiar la base de datos (Ej. de JSON a MongoDB) cambiando solo UNA línea de código.
- **Trazabilidad**: Cada petición genera un `x-correlation-id`. Si algo falla, puedes rastrear todo el flujo en los logs.
- **Loops de Reflexión AI**: Este código fue auditado por una IA especialista en QA antes de ser finalizado.
