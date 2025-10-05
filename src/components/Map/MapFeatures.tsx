import { GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import type { MapProps } from "./MapComponent";
import { getFeatureCentroid, convertToGeoJSON } from "../../utils/geoUtils"

/**
 * Компонент отображения гео-объектов на карте
 * Рендерит полигоны штатов и обрабатывает взаимодействия
 */
const MapFeatures: React.FC<MapProps> = ({
  features,
  selectedId,
  onSelect
}) => {
  const map = useMap();

  // Стили для GeoJSON
  const style = useMemo(() => ({
    color: '#3388ff',
    weight: 2,
    opacity: 0.7,
    fillOpacity: 0.2,
    fillColor: '#3388ff'
  }), []);

  const selectedStyle = useMemo(() => ({
    color: '#ff6600',
    weight: 3,
    opacity: 1,
    fillOpacity: 0.4,
    fillColor: '#ff6600'
  }), []);

  // Обработчик клика по фиче
  const onEachFeature = useMemo(() => (feature: any, layer: any) => {
    layer.on({
      click: (e: any) => {
        // Останавливаем всплытие ДО вызова onSelect
        e.originalEvent.stopPropagation();
        onSelect(feature.id);
        
        // Центрируем карту при клике на штат
        const centroid = getFeatureCentroid(feature);
        if (centroid) {
          map.flyTo(centroid, 7, {
            duration: 1
          });
        }
      },
      mouseover: () => {
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.5
        });
        layer.bringToFront();
      },
      mouseout: () => {
        const isSelected = selectedId === feature.id;
        layer.setStyle(isSelected ? selectedStyle : style);
      }
    });

    // Начальный стиль
    const isSelected = selectedId === feature.id;
    layer.setStyle(isSelected ? selectedStyle : style);
  }, [selectedId, style, selectedStyle, onSelect, map]);

  // FeatureCollection
  const geoJsonData = useMemo(() => convertToGeoJSON(features), [features]);

  if (!features.length) return null;

  return (
    <GeoJSON
      key={`geojson-${selectedId}-${features.length}`}
      data={geoJsonData}
      onEachFeature={onEachFeature}
    />
  );
};

export default MapFeatures;