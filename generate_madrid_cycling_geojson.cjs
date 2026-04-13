const https = require('https');
const fs = require('fs');

console.log('Iniciando descarga de datos ciclistas desde OpenStreetMap...');

const query = `
  [out:json][timeout:90];
  area[name='Madrid'][admin_level=8]->.searchArea;
  (
    way[highway=cycleway](area.searchArea);
    way[cycleway](area.searchArea);
  );
  out geom;
`;

const options = {
  hostname: 'overpass-api.de',
  port: 443,
  path: '/api/interpreter',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Datos descargados. Procesando GeoJSON...');
    try {
      const osmData = JSON.parse(data);
      if(!osmData.elements) throw new Error("No se encontraron elementos en la respuesta.");
      generateGeoJSON(osmData.elements);
    } catch(e) {
      console.error('Error parseando JSON de OSM:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Error de red: ${e.message}`);
});

req.write(query);
req.end();

function classifyRoute(tags) {
  let type = "Desconocido";
  let safety = "Media";
  let surface = tags.surface || tags["cycleway:surface"] || "Desconocida";
  let incline = tags.incline || "Plana/Desconocida";
  
  const highway = tags.highway || "";
  const cycleway = tags.cycleway || tags["cycleway:right"] || tags["cycleway:left"] || "";
  const foot = tags.foot || "";
  const segregated = tags.segregated || "";

  if (highway === 'cycleway') {
    if (segregated === 'no' || foot === 'yes' || foot === 'designated') {
      type = "Senda compartida";
      safety = "Media (Atención a peatones)";
    } else {
      type = "Exclusiva (Carril bici)";
      safety = "Alta";
    }
  } else if (cycleway) {
    if (cycleway === 'lane' || cycleway === 'track') {
      type = "Carril en calzada";
      safety = cycleway === 'track' ? "Alta" : "Media";
    } else if (cycleway === 'shared_lane' || cycleway === 'shared') {
      type = "Ciclocarril (Coches)";
      safety = "Baja";
    } else {
      type = "Infraestructura genérica [" + cycleway + "]";
      safety = "Media";
    }
  }

  const name = tags.name || "";
  let unstyledType = type;
  if (name.toLowerCase().includes("anillo verde")) {
     type = "Anillo Verde Ciclista"; // Make it explicitly stand out
  }

  return { type, unstyledType, safety, surface, incline, name: name || 'Ruta Ciclista' };
}

function generateGeoJSON(elements) {
  const features = [];
  let elementCount = 0;

  for (const el of elements) {
    if (el.type !== 'way' || !el.geometry) continue;
    
    // Limits
    elementCount++;
    if(elementCount > 5000) break;

    const props = classifyRoute(el.tags || {});
    
    // Build coordinates array for GeoJSON LineString
    const coordinates = el.geometry.map(pt => [pt.lon, pt.lat]);

    features.push({
      "type": "Feature",
      "properties": props,
      "geometry": {
        "type": "LineString",
        "coordinates": coordinates
      }
    });
  }

  const geojson = {
    "type": "FeatureCollection",
    "features": features
  };

  fs.writeFileSync('rutas_ciclistas_madrid.json', JSON.stringify(geojson), 'utf8');
  console.log(`✅ GeoJSON generado con éxito (rutas_ciclistas_madrid.json). Total vías: ${elementCount}`);
}
