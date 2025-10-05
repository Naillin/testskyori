import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { getFeatureCentroid } from "../../utils/geoUtils";
import type { MapProps } from "./MapComponent";

/**
 * Компонент управления картой
 * Отвечает за автоматическое центрирование карты при выборе штата
 */
const MapController: React.FC<MapProps> = ({ 
  features,
  selectedId 
}) => {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const selectedFeature = features.find(f => f.id === selectedId);
      if (selectedFeature) {
        const centroid = getFeatureCentroid(selectedFeature);
        if (centroid) {
          // Центрируем карту на центроиде штата с анимацией
          map.flyTo(centroid, 7, {
            duration: 1 // продолжительность анимации в секундах
          });
        }
      }
    }
  }, [selectedId, features, map]);

  return null;
};

export default MapController;