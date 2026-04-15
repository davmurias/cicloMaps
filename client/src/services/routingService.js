/**
 * Interfaz/Adaptador de enrutamiento para el Frontend.
 * Abstrae la lógica de cálculo de rutas del componente MapContainer.
 * 
 * En el futuro (Opción B), esta misma firma de función apuntará
 * a nuestro propio Backend GIS (ej. POST /api/routing/calculate) 
 * en lugar de llamar a servicios públicos, posibilitando el pesaje por seguridad.
 */

export const calculateCyclingRoute = async (origin, destination, waypoints = []) => {
  try {
    // 1. Geocodificación del Origen (Nominatim OSM)
    const origUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(origin + ', Madrid, Spain')}&format=json&limit=1`;
    console.log('[RoutingService] Fetching Origen:', origUrl);
    const origRes = await fetch(origUrl, { headers: { 'Accept-Language': 'es' } });
    const origData = await origRes.json();
    
    // 2. Geocodificación del Destino (Nominatim OSM)
    const destUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination + ', Madrid, Spain')}&format=json&limit=1`;
    console.log('[RoutingService] Fetching Destino:', destUrl);
    const destRes = await fetch(destUrl, { headers: { 'Accept-Language': 'es' } });
    const destData = await destRes.json();

    if (!origData || !origData.length || !destData || !destData.length) {
      console.warn('[RoutingService] No se pudieron encontrar las direcciones.');
      return null;
    }

    const startLng = origData[0].lon;
    const startLat = origData[0].lat;
    const endLng = destData[0].lon;
    const endLat = destData[0].lat;

    // Formatear waypoints intermedios
    const waypointsStr = waypoints && waypoints.length > 0 
      ? ';' + waypoints.map(wp => `${wp.lng},${wp.lat}`).join(';')
      : '';

    // 3. Cálculo de la ruta ciclista (OSRM Público)
    const osrmUrl = `https://router.project-osrm.org/route/v1/bicycle/${startLng},${startLat}${waypointsStr};${endLng},${endLat}?geometries=geojson`;
    console.log('[RoutingService] Fetching OSRM:', osrmUrl);
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    if (osrmData.code === 'Ok' && osrmData.routes.length > 0) {
      console.log('[RoutingService] Ruta encontrada. Puntos:', osrmData.routes[0].geometry.coordinates.length);
      // Convertir formato GeoJSON a array de {lat, lng} requerido por Polyline
      const coords = osrmData.routes[0].geometry.coordinates.map(coord => ({
        lat: parseFloat(coord[1]),
        lng: parseFloat(coord[0])
      }));
      return coords;
    } else {
      console.warn('[RoutingService] OSRM no encontró ruta:', osrmData);
      return null;
    }
  } catch (error) {
    console.error('[RoutingService] Error calculando ruta:', error);
    return null;
  }
};
