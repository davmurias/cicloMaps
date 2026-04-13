import { GoogleMap, useJsApiLoader, Data } from '@react-google-maps/api';
import { useCallback, useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 40.4168,
  lng: -3.7038
};

const MapContainer = ({ onHover }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDMDPcakMCc9kQ2ee8pj3b92T5MclUfonY", // Usando la Key del prototipo original
    libraries: ['places']
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Estilos dinámicos para los tramos ciclistas
  const setStyle = (feature) => {
    const safety = feature.getProperty('safety');
    const type = feature.getProperty('type');
    
    let color = '#94a3b8'; // Desconocido
    let weight = 4;
    let zIndex = 1;

    if (type?.includes('Anillo Verde')) {
      color = '#a855f7';
      weight = 6;
      zIndex = 10;
    } else if (safety?.includes('Alta')) {
      color = '#22c55e';
    } else if (safety?.includes('Media')) {
      color = '#eab308';
    } else if (safety?.includes('Baja')) {
      color = '#ef4444';
    }

    return {
      strokeColor: color,
      strokeWeight: weight,
      strokeOpacity: 0.8,
      zIndex: zIndex
    };
  };

  return isLoaded ? (
    <div id="map-wrapper" style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          disableDefaultUI: true,
          styles: [
            { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#020617" }] }
          ]
        }}
      >
        <Data
          onLoad={(data) => {
             // Cargar el GeoJSON local
             fetch('/rutas_ciclistas_madrid.json')
               .then(res => res.json())
               .then(json => data.addGeoJson(json));
          }}
          onMouseOver={(e) => {
            onHover({
              name: e.feature.getProperty('name'),
              type: e.feature.getProperty('type'),
              safety: e.feature.getProperty('safety'),
              surface: e.feature.getProperty('surface')
            });
          }}
          onMouseOut={() => onHover(null)}
          options={{ style: setStyle }}
        />
      </GoogleMap>
    </div>
  ) : <div className="loading">Cargando Mapa...</div>;
};

export default MapContainer;
