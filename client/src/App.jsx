import { useState, useEffect } from 'react'
import MapContainer from './components/MapContainer'
import Dashboard from './components/Dashboard'
import RoutingPanel from './components/RoutingPanel'
import InfoPanel from './components/InfoPanel'
import './App.css'

function App() {
  const [hoverInfo, setHoverInfo] = useState(null)
  const [history, setHistory] = useState([])

  // Cargar historial desde el Backend (Paso 4b - Integración)
  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/routes', {
        headers: {
          'x-correlation-id': crypto.randomUUID()
        }
      })
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error('Error cargando historial:', error)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="app-container">
      <Dashboard />
      <RoutingPanel onRouteSaved={fetchHistory} />
      <MapContainer onHover={setHoverInfo} />
      <InfoPanel info={hoverInfo} />
      
      {/* Mini panel de historial opcional */}
      {history.length > 0 && (
         <div className="history-toast">
           Ultima ruta: {history[history.length - 1].destination}
         </div>
      )}
    </div>
  )
}

export default App
