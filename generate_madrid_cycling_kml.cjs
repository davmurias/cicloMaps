const https = require('https');
const fs = require('fs');

console.log('Iniciando descarga de datos ciclistas desde OpenStreetMap...');

// Overpass QL for Madrid cycling routes (including geometry directly!)
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
    console.log('Datos descargados. Procesando KML...');
    try {
      const osmData = JSON.parse(data);
      if(!osmData.elements) throw new Error("No se encontraron elementos en la respuesta.");
      generateKML(osmData.elements);
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

function escapeXML(unsafe) {
    if(!unsafe) return "";
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function classifyRoute(tags) {
  let type = "Desconocido";
  let safety = "Media";
  let surface = tags.surface || tags["cycleway:surface"] || "Desconocida";
  let incline = tags.incline || "Plana/Desconocida";
  
  // Categorization Logic
  const highway = tags.highway || "";
  const cycleway = tags.cycleway || tags["cycleway:right"] || tags["cycleway:left"] || "";
  const foot = tags.foot || "";
  const segregated = tags.segregated || "";

  if (highway === 'cycleway') {
    if (segregated === 'no' || foot === 'yes' || foot === 'designated') {
      type = "Senda o vía compartida con peatones";
      safety = "Alta (Atención a peatones)";
    } else {
      type = "Vía ciclista exclusiva";
      safety = "Muy Alta";
    }
  } else if (cycleway) {
    if (cycleway === 'lane' || cycleway === 'track') {
      type = "Carril bici en calzada";
      safety = cycleway === 'track' ? "Alta" : "Media (Pintura/separadores)";
    } else if (cycleway === 'shared_lane' || cycleway === 'shared') {
      type = "Ciclocarril (Compartida con coches)";
      safety = "Baja (Tráfico rodado)";
    } else {
      type = "Infraestructura ciclista genérica [" + cycleway + "]";
      safety = "Media";
    }
  }

  // Focus on Anillo Verde specifically if in name
  const name = tags.name || "";
  if (name.toLowerCase().includes("anillo verde")) {
     type = "Anillo Verde Ciclista - " + type;
  }

  return { type, safety, surface, incline, name: name || 'Ruta Ciclista' };
}

function generateKML(elements) {
  let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Rutas Ciclistas Madrid</name>
    <description>Mapa generado con datos de OpenStreetMap clasificando tipo, seguridad y dificultad.</description>
`;

  let elementCount = 0;

  for (const el of elements) {
    if (el.type !== 'way' || !el.geometry) continue;
    
    // Limits applied. Google My Maps can struggle with massive numbers of features.
    elementCount++;
    // Let's cap at 5000 ways to avoid generating an excessively large unimportable KML file for My Maps
    if(elementCount > 5000) break;

    const props = classifyRoute(el.tags || {});
    
    // Build coordinates
    const coordsStr = el.geometry
      .map(pt => `${pt.lon},${pt.lat}`)
      .join(' ');

    kml += `
    <Placemark>
      <name>${escapeXML(props.name)}</name>
      <ExtendedData>
        <Data name="Tipo de Ruta">
          <value>${escapeXML(props.type)}</value>
        </Data>
        <Data name="Nivel de Seguridad">
          <value>${escapeXML(props.safety)}</value>
        </Data>
        <Data name="Superficie (Dificultad)">
          <value>${escapeXML(props.surface)}</value>
        </Data>
        <Data name="Pendiente">
          <value>${escapeXML(props.incline)}</value>
        </Data>
      </ExtendedData>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
          ${coordsStr}
        </coordinates>
      </LineString>
    </Placemark>`;
  }

  kml += `
  </Document>
</kml>`;

  fs.writeFileSync('rutas_ciclistas_madrid.kml', kml, 'utf8');
  console.log(`✅ KML generado con éxito (rutas_ciclistas_madrid.kml). Total vías: ${elementCount}`);
}
