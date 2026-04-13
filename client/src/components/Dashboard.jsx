const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Red Ciclista Madrid</h1>
      <p>Mapa inteligente autogenerado desde OSM analizando tipología y seguridad en ruta.</p>
      
      <div className="legend">
        <div className="legend-item">
          <div className="color-box" style={{ background: 'var(--anillo)' }}></div>
          <span>Anillo Verde Ciclista</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ background: 'var(--alta)' }}></div>
          <span>Alta Seguridad (Carril Bici)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ background: 'var(--media)' }}></div>
          <span>Media Seguridad (Senda)</span>
        </div>
        <div className="legend-item">
          <div className="color-box" style={{ background: 'var(--baja)' }}></div>
          <span>Baja Seguridad (Ciclocarril)</span>
        </div>
      </div>

      <style jsx>{`
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
        .color-box { width: 30px; height: 8px; border-radius: 4px; box-shadow: 0 0 10px rgba(0,0,0,0.3); }
      `}</style>
    </div>
  )
}

export default Dashboard
