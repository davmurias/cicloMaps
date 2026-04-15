const InfoPanel = ({ info }) => {
  if (!info) return null;

  return (
    <div className="info-panel visible">
      <p className="info-name">{info.name || 'Tramo sin nombre'}</p>
      <p className="info-details">
        <strong>{info.type}</strong><br />
        Seguridad: {info.safety} &bull; Superficie: {info.surface}
      </p>

      <style>{`
        .info-panel {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 16px 24px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .info-panel.visible { opacity: 1; }
        .info-name { font-weight: 700; font-size: 1.1rem; color: #fff; margin: 0; }
        .info-details { font-size: 0.9rem; color: #cbd5e1; margin: 0; line-height: 1.4; }
      `}</style>
    </div>
  );
};

export default InfoPanel;
