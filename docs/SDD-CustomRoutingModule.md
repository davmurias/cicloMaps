# Diseño Arquitectónico: Motor de Rutas Personalizado (Custom GIS Routing)

## 1. Introducción
Este documento define la arquitectura a futuro requerida para habilitar la "Opción B" en la aplicación Mapa Ciclista. Actualmente delegamos el trazado de rutas al servidor público genérico de Open Source Routing Machine (OSRM). 

El objetivo a futuro es que el algoritmo de búsqueda de caminos (*Pathfinding*, como Dijkstra o A*) tome decisiones basadas en los **metadatos de nuestro propio GeoJSON** (especialmente dando peso matemático para cruzar por el Anillo Verde y por tramos con `safety: Alta`).

## 2. Arquitectura Geográfica Propuesta
Para lograr que la seguridad influya en el costo del viaje de un arc, requerimos construir un grafo ruteable en el backend. 

### Opción Recomendada: Valhalla (C++/Docker)
Dado que necesitamos perfiles dinámicos y coste modificado por seguridad, el motor **Valhalla** (creado por Mapzen/Linux Foundation) permite la inyección de atributos de coste dinámico mucho mejor que OSRM estático.

1. **Ingesta de Datos (ETL):** Un script de Node.js o Python transformaría nuestro `Red_Ciclista.geojson` en el formato primario (por ejemplo combinándolo con archivos PBF de OpenStreetMap para las calles donde no haya carril).
2. **Atribución de Pesos:** Se modificaría el generador de grafos de Valhalla (o el perfil Lua si usásemos OSRM Custom) para leer el campo `safety`:
   - `safety: Alta` → Multiplicador de impedancia: `0.5` (Bajísimo coste).
   - `safety: Media` → Multiplicador de impedancia: `1.0`.
   - `safety: Baja` → Multiplicador de impedancia: `3.0`.
   - *Ausencia de datos* (calles normales) → Multiplicador de impedancia `5.0`.
3. **Despliegue:** Un contenedor Docker `ghcr.io/gis-ops/docker-valhalla` se expondría en nuestro backend Node.js.

### Alternativa: pgRouting (PostgreSQL/PostGIS)
Si queremos un control 100% transaccional usando consultas SQL para reescribir los pesos en tiempo real.
- Inserción de las líneas de GeoJSON vía `ogr2ogr` a una base de datos PostgreSQL con la extensión **pgRouting**.
- API Express (Node.js) que ejecute algo como:
  ```sql
  SELECT * FROM pgr_dijkstra(
    'SELECT id, source, target, st_length(geom) * (CASE WHEN safety = ''Alta'' THEN 0.5 ELSE 1.5 END) as cost FROM network',
    nodo_origen, nodo_destino
  );
  ```

## 3. Integración en la Arquitectura Hexagonal Existente
Actualmente, el Front-end asume toda la responsabilidad pidiendo las rutas a servidores de OSM externos. 
Con el nuevo módulo GIS, transicionaríamos a:

1. **Frontend (Capa de Presentación):** El cliente enviará `POST /api/routing/calculate` con el origen y destino al Backend.
2. **Backend (Capa de Aplicación):**
   - El caso de uso en Node.js buscará los puntos Origen/Destino y realizará una proyección al sub-sistema GIS (Valhalla o pgRouting).
   - Valhalla / pgRouting retornará un vector `LineString` tras someter la traza al escrutinio de los pesos de la topología ciclista de Madrid.
3. **Frontend (Adaptadores):** El módulo `routingService.js` simplemente apuntará a nuestro servidor local y pasará la línea renderizable por el Polyline del frontend, haciendo que el intercambio sea invisible para el UI de React.
