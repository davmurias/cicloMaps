# Architecture Documentation (Para nuestro Yo del Futuro)

Este documento centraliza el "por qué" detrás del "cómo". Su objetivo es que si retomamos este proyecto dentro de 3 años, entendamos exactamente la topología de la aplicación.

## 1. Visión Global (Full-Stack & DevOps)
Dejamos de ser un monolito de html estático para convertirnos en un servicio multi-capa distribuido.
- **Frontend (SPA):** React + Vite. Elegido por su velocidad extrema HRMR y control absoluto del estado.
- **Backend (API):** Node.js + Express.
- **Gestión de Cargas:** Despliegue pautado mediante contenedores `Docker` gestionado por herramientas Ci/CD GitHub Actions hacia un servidor remoto VPS Linux (PiensaSolutions).

## 2. El Patrón Hexagonal en el Backend
Elegimos **Arquitectura Hexagonal (Puertos y Adaptadores)** de manera puritana. 
¿Por qué? Porque empezamos persintiendo rutas en un archivo `database.json`, pero sabiamos que tarde o temprano escalaríamos a `PostgreSQL`. 
Gracias al esquema Hexagonal, inyectar PostgreSQL significa simplemente crear un objeto que satisfaga el "Puerto" `IRouteRepository`. Ni la lógica de buscar (UseCase) ni el Express Router (Entrada) notarán que cambiamos la base de datos de producción.

## 3. Proxying, CORS y Seguridad
Por seguridad estricta y delegación del *Security Expert* (OWASP), la arquitectura del Frontend manda enrutadores "secos".
1. Es decir, el usuario nunca habla con el OpenStreetMap Nominatim público ni el servidor OSRM. Las peticiones salen del frontend pidiendo calcular una ruta a `/api/routing`, y es nuestro servidor backend el que hace la aserción y se comunica con las APIs externas o bases de datos nativas (Opción B).
2. De esta forma la API Key nunca baja al front `VITE_GOOGLE_MAPS_API...` y el navegador del usuario final no sufre restricciones de tasa (Rate Limiting).

## 4. Opciones de Ruteo Cartográfico
**Problema histórico:** Trazábamos rutas maravillosas, pero el enrutador europeo OSRM hacía "snapping" erróneos y nos obligaba a salir de parques porque no figuraban como ciclables en el estándar germánico.
- **Solución Final (Opción B):** Nuestro Docker de PostgreSQL incluirá PostGIS/pgRouting. Le pasaremos internamente los GeoJSON de Madrid con las ciclovías, y nosotros mismos forzaremos el cálculo de camino más corto `A*` sobre nuestra topología cerrada.
- **Fallback (Opción A):** OSRM Público se deja intacto en una rama condicional para emergencias si nuestro postgres fallase.

## 5. El Modelo Agéntico y Loops de Reflexión
El trabajo lo generan una red de Agentes de IA (Backend, Frontend) los cuales se envían información a ciegas. Están controlados por "Arquitectos Consultores" e inhibidores de despliegue (`qa_reviewer`, `ui_ux_expert`, `security_expert`, `a11y_expert`).
- Tu instrucción es siempre la "Suma Sacerdotisa": Cualquier parche "Human-in-the-Loop" paraliza tests automáticos y se registra en memoria vectorial para corregir futuros agentes.
