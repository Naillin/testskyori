import MapComponent from './components/Map/MapComponent';
import LegendPanel from './components/LegendPanel';
import { useGeoJson } from "./hooks/useGeoJson";
import { useSelection } from "./hooks/useSelection";
import './App.css';

/**
 * Главный компонент приложения
 * Связывает карту и панель легенды, управляет состоянием выбора
 */
function App() {
  const { features, sortedFeatures } = useGeoJson();
  const selection = useSelection(null);

  return (
    <div className="app-root">
      <div className="sidebar">
        <LegendPanel
          sortedFeatures={sortedFeatures}
          selectedId={selection.selectedId}
          onSelect={selection.selectById}
          onClearSelection={selection.clearSelection}
        />
      </div>
      
      <div className="map-container">
        <MapComponent
          features={features}
          selectedId={selection.selectedId}
          onSelect={selection.selectById}
        />
      </div>
    </div>
  )
}

export default App