import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { calculateCyclingRoute } from '../services/routingService';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.4168,
  lng: -3.7038
};

const libraries = ['places', 'geometry'];

const MapContainer = ({ onHover, routeParams, setRouteParams, filters }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDMDPcakMCc9kQ2ee8pj3b92T5MclUfonY",
    libraries
  });

  const [map, setMap] = useState(null);
  const [routePath, setRoutePath] = useState(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (isLoaded) {
      if (routeParams) {
        calculateCyclingRoute(routeParams.origin, routeParams.destination, routeParams.waypoints || [])
          .then(coords => setRoutePath(coords))
          .catch(() => setRoutePath(null));
      } else {
        setRoutePath(null);
      }
    }
  }, [isLoaded, routeParams]);

  // Manejador de visualización de Waypoints y eventos
  useEffect(() => {
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    if (map && routeParams && routeParams.waypoints) {
      routeParams.waypoints.forEach((wp, idx) => {
        const marker = new window.google.maps.Marker({
          position: wp,
          map: map,
          title: 'Waypoint (Click derecho para eliminar)',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#facc15',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 2
          }
        });

        marker.addListener('rightclick', () => {
          const newWaypoints = [...routeParams.waypoints];
          newWaypoints.splice(idx, 1);
          setRouteParams({ ...routeParams, waypoints: newWaypoints });
        });

        markersRef.current.push(marker);
      });
    }
  }, [map, routeParams, setRouteParams]);

  // Click handler del mapa para inyectar waypoints
  useEffect(() => {
    if (!map) return;
    const clickListener = window.google.maps.event.addListener(map, 'click', (e) => {
      if (!routeParams || !routePath || routePath.length === 0) return;
      
      const clickPoint = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      const currentWps = routeParams.waypoints || [];
      
      // Algoritmo topológico de inyección por proximidad al segmento lógico
      const findClosestIndex = (path, point) => {
        let minIdx = 0, minDist = Infinity;
        path.forEach((p, idx) => {
          const dist = Math.pow(p.lat - point.lat, 2) + Math.pow(p.lng - point.lng, 2);
          if (dist < minDist) { minDist = dist; minIdx = idx; }
        });
        return minIdx;
      };

      const wpsWithIndices = currentWps.map(w => ({ wp: w, idx: findClosestIndex(routePath, w) }));
      wpsWithIndices.push({ wp: clickPoint, idx: findClosestIndex(routePath, clickPoint) });
      wpsWithIndices.sort((a, b) => a.idx - b.idx);

      setRouteParams({ ...routeParams, waypoints: wpsWithIndices.map(i => i.wp) });
    });

    return () => window.google.maps.event.removeListener(clickListener);
  }, [map, routeParams, routePath, setRouteParams]);

  const setStyle = useCallback((feature) => {
    const safety = feature.getProperty('safety');
    const type = feature.getProperty('type');
    
    let color = '#94a3b8'; // Desconocido
    let weight = 4;
    let zIndex = 1;
    let category = 'baja';

    if (type?.includes('Anillo Verde')) {
      color = '#a855f7';
      weight = 6;
      zIndex = 10;
      category = 'anillo';
    } else if (safety?.includes('Alta')) {
      color = '#22c55e';
      category = 'alta';
    } else if (safety?.includes('Media')) {
      color = '#eab308';
      category = 'media';
    } else if (safety?.includes('Baja')) {
      color = '#ef4444';
      category = 'baja';
    }

    // Comprobamos si el usuario ha desmarcado esta categoría
    const isVisible = filters && filters[category] !== undefined ? filters[category] : true;

    return {
      strokeColor: color,
      strokeWeight: weight,
      strokeOpacity: isVisible ? 0.8 : 0,
      visible: isVisible, // Apagamos a nivel de Canvas nativo
      zIndex: zIndex
    };
  }, [filters]);

  // Vuelve a aplicar los estilos si el map o los filtros cambian
  useEffect(() => {
    if (map && map.data) {
      map.data.setStyle(setStyle);
    }
  }, [map, setStyle, filters]);

  const onLoad = useCallback(function callback(map) {
    setMap(map);

    // Cargar GeoJSON de forma nativa para evitar bugs de <Data> de React
    fetch('/api/geojson')
      .then(res => res.json())
      .then(json => {
        map.data.addGeoJson(json);
        map.data.setStyle(setStyle);
      })
      .catch(err => console.error('Error nativo cargando GeoJSON:', err));

    // Eventos nativos
    map.data.addListener('mouseover', (e) => {
      if (onHover) {
        onHover({
          name: e.feature.getProperty('name'),
          type: e.feature.getProperty('type'),
          safety: e.feature.getProperty('safety'),
          surface: e.feature.getProperty('surface')
        });
      }
    });

    map.data.addListener('mouseout', () => {
      if (onHover) onHover(null);
    });
  }, [setStyle, onHover]);

  const onUnmount = useCallback(function callback(map) {
    if (map) {
      window.google.maps.event.clearInstanceListeners(map.data);
    }
    setMap(null);
  }, []);

  const mapOptions = useMemo(() => ({
    disableDefaultUI: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
    ]
  }), []);

  // Efecto nativo para trazar y limpiar la polyline sin wrappers de React
  useEffect(() => {
    if (map) {
      // 1. Limpiamos ruta anterior si existe
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
      
      // 2. Si hay nueva ruta, la trazamos nativamente
      if (routePath && routePath.length > 0) {
        polylineRef.current = new window.google.maps.Polyline({
          path: routePath,
          strokeColor: '#0ea5e9', // Azul eléctrico vibrante
          strokeWeight: 6,
          strokeOpacity: 0.9,
          zIndex: 99,
          map: map // Forzamos la unión nativa al lienzo
        });
      }
    }
  }, [map, routePath]);

  return isLoaded ? (
    <div id="map-wrapper" style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Usamos el Canvas pelado. La red se carga por map.data y la ruta por native Polyline */}
      </GoogleMap>
    </div>
  ) : <div className="loading">Cargando Mapa...</div>;
};

export default MapContainer;
