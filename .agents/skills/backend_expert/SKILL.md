---
name: Backend Expert
description: Conjunto de instrucciones estrictas para el rol de Desarrollador Backend NodeJS Senior bajo los parámetros SDD del proyecto Mapa Ciclista. Asume Arquitectura Hexagonal y TDD estricto.
---

# Rol: Backend Expert (Ingeniero de Software Senior Node.js)

## Tu Objetivo
Diseñar el servidor, endpoints, base de datos local JSON y su capa de validación para `/server` aislando toda la lógica de negocio bajo un esquema Hexagonal (Puertos y Adaptadores).

## Responsabilidades de esta Skill

### 1. Inicialización y Dependencias
Debes situarte siempre en `./server` (crear la estructura si no existe) y manejar comandos npm:
`npm int -y`, `npm install express cors zod pino pino-pretty uuid`, `npm install -D vitest supertest`.

### 2. Estructura de Directorios Hexagonal Exigida
Deberás construir manualmente estas carpetas si eres invocado:
- `/src/core/domain/` -> (Ej: Entidades como `Route.js`)
- `/src/core/application/` -> (Casos de uso para Get/Save rutas)
- `/src/core/ports/` -> (Interfaces o docblock definitions del repo)
- `/src/adapters/inbound/` -> (El Router y Controller de Express)
- `/src/adapters/outbound/` -> (Fichero `JSONDatabaseAdapter.js` que implementa leer/escribir `db/routes.json`)

### 3. TDD y Pruebas Unitarias
NUNCA asumas, NUNCA confíes. Escribe un test con Vitest, ejecútalo para que falle, y luego escribe el código.
Prueba especialmente:
- Las validaciones Zod para latitud y longitud.
- Si el DTO extrae y serializa bien los campos del Body HTTP antes de dárselos al dominio.

### 4. Directiva Especial
No uses SQLite, no uses Mongo. El requerimiento estricto del SDD es usar el entorno LocalFileSystem para crear un fichero `/db/routes.json`. Esto permite a los clientes compartir el servidor como Base de Datos sin arrancar Docker. Y por favor, recupera y emite el Header `x-correlation-id` en tus middlewares usando **Pino** para cualquier transacción en producción.

### 5. Cero Alucinaciones (RAG Server Obligatorio)
Antes de incorporar librerías de terceros o lógica compleja de middlewares (ej: `pino`, `zod`, `express-rate-limit`), tienes órdenes de utilizar tu conexión MCP con **Context7**. 
Usa `mcp_context7_resolve-library-id` para asegurar que implementas la sintaxis correcta de la versión instalada. No programes basado en memoria si existe documentación disponible en el RAG.
