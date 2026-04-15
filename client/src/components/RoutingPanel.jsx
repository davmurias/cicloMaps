import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const RoutingPanel = ({ onRouteSaved, onCalculateRoute }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = async () => {
    if (!origin || !destination) return;
    
    setIsLoading(true);
    setStatus('Calculando ruta...');

    if (onCalculateRoute) {
      onCalculateRoute({ origin, destination });
    }

    setStatus('Guardando ruta en historial...');

    try {
      const response = await fetch('/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-correlation-id': uuidv4()
        },
        body: JSON.stringify({
          origin: origin,
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

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    setStatus('');
    if (onCalculateRoute) {
      onCalculateRoute(null);
    }
  };

  return (
    <div className="routing-panel">
      <h2>Navegar a destino</h2>
      <input 
        type="text" 
        className="routing-input" 
        placeholder="Introduce el origen..." 
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input 
        type="text" 
        className="routing-input" 
        placeholder="Introduce el destino..." 
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <div className="button-group">
        <button 
          className="routing-btn primary-btn" 
          onClick={handleNavigate}
          disabled={isLoading}
        >
          {isLoading ? '...' : 'Llevarme allí'}
        </button>
        <button 
          className="routing-btn secondary-btn" 
          onClick={handleClear}
          disabled={isLoading}
        >
          Limpiar
        </button>
      </div>
      {status && <p className="routing-status">{status}</p>}

      <style>{`
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
        .routing-input { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 10px; padding: 12px; color: #fff; outline: none; margin-bottom: 4px; }
        .button-group { display: flex; gap: 8px; width: 100%; }
        .routing-btn { flex: 1; border: none; border-radius: 10px; padding: 12px; color: #fff; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
        .routing-btn:hover { opacity: 0.9; }
        .primary-btn { background: linear-gradient(135deg, #38bdf8, #818cf8); }
        .secondary-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }
        .routing-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .routing-status { font-size: 0.8rem; color: #94a3b8; margin: 0; text-align: center; }
      `}</style>
    </div>
  );
};

export default RoutingPanel;
