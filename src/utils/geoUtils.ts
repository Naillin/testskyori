import type { IState } from "../types/types";

/**
 * Вспомогательные типы для возврата, удобные для Leaflet:
 * LatLngExpression = [lat, lng]; LatLngBoundsExpression = [[southWestLat, southWestLng], [northEastLat, northEastLng]]
 */

/**
 * Преобразует координаты фичи в плоский массив
 * @param feature - геообъект штата
 * @returns массив координат [lng, lat]
 */
function flattenCoordinates(feature: IState): Array<[number, number]> {
  const geom = feature.geometry;
  const coords: Array<[number, number]> = [];

  if (!geom || !geom.type || !Array.isArray(geom.coordinates)) return coords;

  if (geom.type === "Polygon") {
    // Polygon: [ [ [lng, lat], [lng, lat], ... ] , ...rings]
    for (const ring of geom.coordinates as number[][][]) {
      for (const pt of ring) {
        if (Array.isArray(pt) && pt.length >= 2) {
          coords.push([pt[0], pt[1]]); // [lng, lat]
        }
      }
    }
  } else if (geom.type === "MultiPolygon") {
    // MultiPolygon: [ [ [ [lng, lat], ... ] ], ...polygons ]
    for (const polygon of geom.coordinates as number[][][][]) {
      for (const ring of polygon) {
        for (const pt of ring) {
          if (Array.isArray(pt) && pt.length >= 2) {
            coords.push([pt[0], pt[1]]);
          }
        }
      }
    }
  }

  return coords;
}

/**
 * Вычисляет границы фичи для отображения на карте
 * @param feature - геообъект штата
 * @returns границы в формате Leaflet [[southWest, northEast]]
 */
export function getFeatureBounds(feature: IState): [[number, number], [number, number]] | null {
  const pts = flattenCoordinates(feature);
  if (!pts.length) return null;

  let minLng = Number.POSITIVE_INFINITY;
  let maxLng = Number.NEGATIVE_INFINITY;
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;

  for (const [lng, lat] of pts) {
    if (typeof lng !== "number" || typeof lat !== "number") continue;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }

  // Leaflet ожидает [lat, lng]
  return [
    [minLat, minLng], // southWest
    [maxLat, maxLng], // northEast
  ];
}

/**
 * Вычисляет центроид (геометрический центр) фичи
 * @param feature - геообъект штата
 * @returns координаты центра [lat, lng]
 */
export function getFeatureCentroid(feature: IState): [number, number] | null {
  const pts = flattenCoordinates(feature);
  if (!pts.length) return null;

  let sumLng = 0;
  let sumLat = 0;
  let n = 0;

  for (const [lng, lat] of pts) {
    if (typeof lng !== "number" || typeof lat !== "number") continue;
    sumLng += lng;
    sumLat += lat;
    n += 1;
  }

  if (n === 0) return null;

  const avgLng = sumLng / n;
  const avgLat = sumLat / n;
  return [avgLat, avgLng]; // [lat, lng]
}

/**
 * Конвертирует массив фич в формат GeoJSON FeatureCollection
 * @param features - массив геообъектов
 * @returns объект в формате GeoJSON
 */
export function convertToGeoJSON(features: IState[]) {
  return {
    type: "FeatureCollection" as const,
    features: features.map(feature => ({
      type: "Feature" as const,
      id: feature.id,
      properties: feature.properties,
      geometry: feature.geometry
    }))
  };
}
