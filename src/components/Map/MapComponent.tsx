import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapController from "./MapController"
import MapFeatures from "./MapFeatures";
import type { IState } from "../../types/types";

export interface MapProps {
  features: IState[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const INITIAL_CENTER: [number, number] = [39.8283, -98.5795];
const INITIAL_ZOOM = 4;

const USA_BOUNDS: [[number, number], [number, number]] = [
  [18.9, -180], // Юго-запад (включая Гавайи)
  [71.5, -65]   // Северо-восток (включая Аляску)
];

/**
 * Главный компонент карты
 * Инициализирует карту Leaflet с базовыми настройками
 */
const MapComponent: React.FC<MapProps> = (props) => {
  return (
    <MapContainer 
      center={INITIAL_CENTER} 
      zoom={INITIAL_ZOOM} 
      style={{ height: "100%", width: "100%" }}
      maxBounds={USA_BOUNDS}
      minZoom={4}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      <MapController {...props} />
      <MapFeatures {...props} />
    </MapContainer>
  );
};

export default MapComponent;