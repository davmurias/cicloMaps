import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RoutingPanel = ({ onRouteSaved }) => {
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = async () => {
    if (!destination) return;
    
    setIsLoading(true);
    setStatus('Guardando ruta en historial...');

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': uuidv4()
        },
        body: JSON.stringify({
          origin: 'Mi Ubicación', // En una app real usaríamos Geolocation
          destination: destination,
          waypoints: []
        })
      });

      if (response.ok) {
        setStatus('Ruta guardada con éxito.');
        setDestination('');
        onRouteSaved(); // Notificar a App para recargar historial
      } else {
        setStatus('Fallo al guardar ruta.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  return (
    <div className="routing-panel">
      <h2>Navegar a destino</h2>
      <input 
        type="text" 
        className="routing-input" 
        placeholder="Introduce el destino..." 
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button 
        className="routing-btn" 
        onClick={handleNavigate}
        disabled={isLoading}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {isLoading ? '...' : 'Llevarme allí (GPS)'}
        </span>
      </button>
      {status && <p className="routing-status">{status}</p>}

      <style jsx>{`
        .routing-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          width: 300px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        h2 { margin: 0; font-size: 1.2rem; color: #fff; background: linear-gradient(to right, #38bdf8, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .routing-input { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 12px; color: #fff; outline: none; }
        .routing-btn { background: linear-gradient(135deg, #38bdf8, #818cf8); border: none; border-radius: 10px; padding: 12px; color: #fff; font-weight: 700; cursor: pointer; }
        .routing-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .routing-status { font-size: 0.8rem; color: #94a3b8; margin: 0; text-align: center; }
      `}</style>
    </div>
  );
};

export default RoutingPanel;
