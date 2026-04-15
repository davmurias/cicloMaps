const Dashboard = ({ history, onSelectRoute, filters, onToggleFilter }) => {
  return (
    <div className="dashboard">
      <h1>Red Ciclista Madrid</h1>
      <p>Mapa inteligente autogenerado desde OSM analizando tipología y seguridad en ruta.</p>
      
      <div className="legend">
        <div 
          className="legend-item interactive" 
          onClick={() => onToggleFilter('anillo')}
          style={{ opacity: filters.anillo ? 1 : 0.4 }}
        >
          <div className="color-box" style={{ background: 'var(--anillo)' }}></div>
          <span>Anillo Verde Ciclista</span>
        </div>
        <div 
          className="legend-item interactive" 
          onClick={() => onToggleFilter('alta')}
          style={{ opacity: filters.alta ? 1 : 0.4 }}
        >
          <div className="color-box" style={{ background: 'var(--alta)' }}></div>
          <span>Alta Seguridad (Carril Bici)</span>
        </div>
        <div 
          className="legend-item interactive" 
          onClick={() => onToggleFilter('media')}
          style={{ opacity: filters.media ? 1 : 0.4 }}
        >
          <div className="color-box" style={{ background: 'var(--media)' }}></div>
          <span>Media Seguridad (Senda)</span>
        </div>
        <div 
          className="legend-item interactive" 
          onClick={() => onToggleFilter('baja')}
          style={{ opacity: filters.baja ? 1 : 0.4 }}
        >
          <div className="color-box" style={{ background: 'var(--baja)' }}></div>
          <span>Baja Seguridad (Ciclocarril)</span>
        </div>
        <div className="legend-item" style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="color-box" style={{ background: '#0ea5e9', boxShadow: '0 0 10px rgba(14, 165, 233, 0.5)' }}></div>
          <span style={{ color: '#fff', fontWeight: '500' }}>Ruta Actual / Navegación</span>
        </div>
      </div>

      {history && history.length > 0 && (
        <div className="history-section">
          <h3>Historial de Rutas</h3>
          <ul className="history-list">
            {history.slice(-5).reverse().map(route => (
              <li 
                key={route.id} 
                className="history-item" 
                onClick={() => onSelectRoute({ origin: route.origin, destination: route.destination })}
              >
                <div className="history-icon">📍</div>
                <div className="history-details">
                  <span className="history-route">{route.origin} <span style={{color: '#94a3b8', margin: '0 4px'}}>→</span> {route.destination}</span>
                  <span className="history-date">{new Date(route.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .dashboard {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 10;
          background: var(--card-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 24px;
          width: 300px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .dashboard:hover { transform: translateY(-5px); }
        h1 { margin: 0 0 8px 0; font-size: 1.5rem; background: linear-gradient(to right, var(--glow), #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { margin: 0 0 20px 0; font-size: 0.9rem; color: #94a3b8; font-weight: 300; }
        .legend { display: flex; flex-direction: column; gap: 10px; }
        .legend-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; }
        .interactive { cursor: pointer; transition: opacity 0.2s; }
        .interactive:hover { opacity: 0.8 !important; }
        .color-box { width: 30px; height: 8px; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
        
        .history-section { border-top: 1px solid rgba(255,255,255,0.1); margin-top: 24px; padding-top: 20px; }
        .history-section h3 { margin: 0 0 16px 0; font-size: 1rem; color: #e2e8f0; font-weight: 500; }
        .history-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
        .history-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .history-item:hover { background: rgba(56, 189, 248, 0.1); border-color: rgba(56, 189, 248, 0.3); transform: translateX(5px); }
        .history-icon { font-size: 1.2rem; }
        .history-details { display: flex; flex-direction: column; gap: 4px; }
        .history-route { font-size: 0.85rem; color: #f8fafc; font-weight: 500; text-transform: capitalize; }
        .history-date { font-size: 0.75rem; color: #64748b; }
      `}</style>
    </div>
  )
}

export default Dashboard
