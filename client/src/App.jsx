import { useState, useEffect } from 'react'
import MapContainer from './components/MapContainer'
import Dashboard from './components/Dashboard'
import RoutingPanel from './components/RoutingPanel'
import InfoPanel from './components/InfoPanel'
import './App.css'

function App() {
  const [hoverInfo, setHoverInfo] = useState(null)
  const [history, setHistory] = useState([])
  const [routeParams, setRouteParams] = useState(null)
  
  const [filters, setFilters] = useState({
    anillo: true,
    alta: true,
    media: true,
    baja: true
  })

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
      <Dashboard 
        history={history} 
        onSelectRoute={setRouteParams} 
        filters={filters} 
        onToggleFilter={(key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }))} 
      />
      <RoutingPanel onRouteSaved={fetchHistory} onCalculateRoute={setRouteParams} />
      <MapContainer onHover={setHoverInfo} routeParams={routeParams} setRouteParams={setRouteParams} filters={filters} />
      <InfoPanel info={hoverInfo} />
    </div>
  )
}

export default App
