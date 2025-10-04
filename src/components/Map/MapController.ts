import { useEffect } from "react";
import type { IState } from "../../types/types";
import { useMap } from "react-leaflet";
import { getFeatureCentroid } from "../../utils/geoUtils";

// Компонент для управления центрированием карты
const MapController: React.FC<{
  selectedId: string | null;
  features: IState[]
}> = ({ 
  selectedId, 
  features 
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